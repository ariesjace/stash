import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const db = await connectToDatabase();
    const inventoryCollection = db.collection("inventory");
    const maintenanceCollection = db.collection("maintenance");

    // Fetch defective assets
    const defectiveAssets = await inventoryCollection
      .find({ status: "defective" })
      .toArray();

    // Attach worklogs to each asset
    const assetsWithLogs = await Promise.all(
      defectiveAssets.map(async (asset) => {
        const worklogs = await maintenanceCollection
          .find({ assetId: new ObjectId(asset._id) })
          .sort({ createdAt: 1 }) // oldest first
          .toArray();

        return {
          ...asset,
          worklogs: worklogs.map((log) => ({
            update: log.update,
            createdAt: log.createdAt,
            _id: log._id.toString(),
          })),
        };
      })
    );

    res.status(200).json({ data: assetsWithLogs });
  } catch (error) {
    console.error("Error fetching defective assets:", error);
    res.status(500).json({ error: "Failed to fetch defective assets" });
  }
}
