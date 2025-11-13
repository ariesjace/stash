import { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "@/lib/MongoDB"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  const { assetTag, status, newUser, oldUser, remarks, department, position } = req.body

  if (!assetTag) {
    return res.status(400).json({ error: "assetTag is required" })
  }

  try {
    const db = await connectToDatabase()
    const inventoryCollection = db.collection("inventory")

    // Find the existing asset
    const existingAsset = await inventoryCollection.findOne({ assetTag })
    if (!existingAsset) {
      return res.status(404).json({ error: "Asset not found in inventory" })
    }

    // Prepare fields to update
    const updateFields: Record<string, any> = { updatedAt: new Date() }
    if (status) updateFields.status = status
    if (newUser) updateFields.newUser = newUser
    if (oldUser) updateFields.oldUser = oldUser
    if (remarks) updateFields.remarks = remarks
    if (department) updateFields.department = department
    if (position) updateFields.position = position

    // Update the asset
    const result = await inventoryCollection.updateOne(
      { assetTag },
      { $set: updateFields }
    )

    // Fetch the updated asset
    const updatedAsset = await inventoryCollection.findOne({ assetTag })

    // Fetch updated lists for both pages
    const spareAssets = await inventoryCollection.find({ status: "spare" }).toArray()
    const deployedAssets = await inventoryCollection.find({ status: "deployed" }).toArray()

    res.status(200).json({
      message: "Asset updated successfully",
      updatedAsset,
      spareAssets,
      deployedAssets,
      modifiedCount: result.modifiedCount,
    })
  } catch (err) {
    console.error("Error updating asset:", err)
    res.status(500).json({
      error: "Failed to update asset",
      details: err instanceof Error ? err.message : "Unknown error",
    })
  }
}
