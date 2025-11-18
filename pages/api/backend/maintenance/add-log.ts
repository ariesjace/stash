import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const db = await connectToDatabase();
    const maintenanceCollection = db.collection("maintenance");

    const { assetId, comment } = req.body;
    if (!assetId || !comment) {
      return res.status(400).json({ error: "assetId and comment are required" });
    }

    const newLog = {
      assetId: assetId.toString(),
      comment,
      createdAt: new Date(),
    };

    const result = await maintenanceCollection.insertOne(newLog);

    res.status(201).json({
      message: "Worklog added successfully",
      data: { ...newLog, _id: result.insertedId.toString() },
    });
  } catch (error) {
    console.error("Error adding worklog:", error);
    res.status(500).json({ error: "Failed to add worklog" });
  }
}
