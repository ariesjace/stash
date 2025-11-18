import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const db = await connectToDatabase();
    const maintenanceCollection = db.collection("maintenance");

    const { assetId } = req.query;
    if (!assetId) {
      return res.status(400).json({ error: "assetId is required" });
    }

    const logs = await maintenanceCollection
      .find({ assetId: assetId.toString() })
      .sort({ createdAt: 1 })
      .toArray();

    res.status(200).json({
      data: logs.map((log) => ({
        comment: log.comment,
        createdAt: log.createdAt,
        _id: log._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching worklogs:", error);
    res.status(500).json({ error: "Failed to fetch worklogs" });
  }
}
