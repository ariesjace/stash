import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const collection = db.collection("maintenance");

  try {
    const { assetId } = req.query;

    // CREATE WORKLOG (POST)
    if (req.method === "POST") {
      const { assetId: bodyAssetId, update } = req.body;

      if (!bodyAssetId || !update) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newEntry = {
        assetId: new ObjectId(bodyAssetId),
        update,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newEntry);

      return res.status(201).json({
        message: "Worklog entry created",
        data: { ...newEntry, _id: result.insertedId.toString() },
      });
    }

    if (!assetId) {
      return res.status(400).json({ error: "Missing assetId" });
    }

    // GET ALL WORKLOGS FOR AN ASSET
    if (req.method === "GET") {
      const records = await collection
        .find({ assetId: new ObjectId(String(assetId)) })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({ data: records });
    }

    // DELETE WORKLOG ENTRY (optional)
    if (req.method === "DELETE") {
      const { logId } = req.body;
      if (!logId) return res.status(400).json({ error: "Missing logId" });

      const deleted = await collection.deleteOne({ _id: new ObjectId(logId) });
      return res.status(200).json({ message: "Deleted", deletedCount: deleted.deletedCount });
    }

    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("Maintenance API Error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
}
