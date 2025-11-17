import { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "@/lib/MongoDB"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    const db = await connectToDatabase()
    const inventoryCollection = db.collection("inventory")
    const data = req.body

    const {
      assetTag,
      assetType,
      brand,
      model,
      serialNumber,
      status,
      newUser,
      oldUser,
      remarks,
      department,
      position,
      location,
    } = data

    if (!assetTag) {
      return res.status(400).json({ error: "Asset Tag is required" })
    }

    // Check if asset already exists
    const existingAsset = await inventoryCollection.findOne({ assetTag })

    let upsertedAsset
    if (existingAsset) {
      // ✅ Asset exists — update instead of creating
      const updateFields: Record<string, any> = {
        assetType: assetType || existingAsset.assetType,
        brand: brand || existingAsset.brand,
        model: model || existingAsset.model,
        serialNumber: serialNumber || existingAsset.serialNumber,
        status: status || existingAsset.status,
        newUser: newUser || existingAsset.newUser,
        oldUser: oldUser || existingAsset.oldUser,
        remarks: remarks || existingAsset.remarks,
        department: department || existingAsset.department,
        position: position || existingAsset.position,
        location: location || existingAsset.location,
        updatedAt: new Date(),
      }

      await inventoryCollection.updateOne(
        { assetTag },
        { $set: updateFields }
      )

      upsertedAsset = await inventoryCollection.findOne({ assetTag })
    } else {
      // ✅ Asset does not exist — create new
      const document = {
        assetTag,
        assetType: assetType || "",
        brand: brand || "",
        model: model || "",
        serialNumber: serialNumber || "",
        status: status || "spare",
        newUser: newUser || "",
        oldUser: oldUser || "",
        remarks: remarks || "",
        department: department || "",
        position: position || "",
        location: location || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await inventoryCollection.insertOne(document)
      upsertedAsset = document
    }

    // Fetch updated lists
    const spareAssets = await inventoryCollection.find({ status: "spare" }).toArray()
    const deployedAssets = await inventoryCollection.find({ status: "deployed" }).toArray()

    return res.status(200).json({
      message: existingAsset ? "Asset updated successfully" : "Asset created successfully",
      asset: upsertedAsset,
      spareAssets,
      deployedAssets,
    })
  } catch (error) {
    console.error("Error creating/updating asset:", error)
    return res.status(500).json({
      error: "Failed to create or update inventory item",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
