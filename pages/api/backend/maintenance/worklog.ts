import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { assetId, update, status, technician } = req.body;

    if (!assetId || !update) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const db = await connectToDatabase();
      const createdAt = new Date();

      const result = await db.collection("maintenance").insertOne({
        assetId: Number(assetId),
        update,
        status,
        technician,
        createdAt,
      });

      return res.status(201).json({
        data: {
          id: result.insertedId.toString(),
          assetId: Number(assetId),
          update,
          status,
          technician,
          date: createdAt,
        },
      });
    } catch (error) {
      console.error("Error creating worklog:", error);
      return res.status(500).json({ error: "Failed to create worklog" });
    }
  }

  if (req.method === "GET") {
    const { assetId } = req.query;

    if (!assetId) {
      return res.status(400).json({ error: "Missing assetId" });
    }

    try {
      const db = await connectToDatabase();

      const worklogs = await db
        .collection("maintenance_worklogs")
        .find({ assetId: Number(assetId) })
        .sort({ createdAt: -1 })
        .toArray();

      const formatted = worklogs.map((item: any) => ({
        id: item._id.toString(),
        assetId: item.assetId,
        update: item.update,
        status: item.status,
        technician: item.technician,
        date: new Date(item.createdAt),
      }));

      return res.status(200).json({ data: formatted });
    } catch (error) {
      console.error("Error fetching worklogs:", error);
      return res.status(500).json({ error: "Failed to fetch worklogs" });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
