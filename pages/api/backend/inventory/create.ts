import { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "@/lib/MongoDB"

export default async function createInventory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .end(`Method ${req.method} Not Allowed`)
  }

  try {
    const db = await connectToDatabase()
    const collection = db.collection("inventory")

    const newItem = req.body

    if (!newItem) {
      return res.status(400).json({ error: "Missing request body" })
    }

    // Optional: Validate required fields before inserting
    if (!newItem.assetType || !newItem.assetTag) {
      return res
        .status(400)
        .json({ error: "assetType and assetTag are required" })
    }

    // Insert new document into MongoDB
    const result = await collection.insertOne({
      ...newItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return res
      .status(201)
      .json({ message: "Item added successfully", id: result.insertedId })
  } catch (error) {
    console.error("Error adding inventory item:", error)
    return res.status(500).json({ error: "Failed to add inventory item" })
  }
}
