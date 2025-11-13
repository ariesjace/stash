import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const db = await connectToDatabase();
    const inventoryCollection = db.collection("inventory");

    // Fetch assets with status "spare" or "deployed"
    const spareOrDeployedAssets = await inventoryCollection
      .find({ status: "spare" })
      .project({
        assetTag: 1,
        assetType: 1,
        brand: 1,
        model: 1,
        serialNumber: 1,
        status: 1,
        ram: 1,
        storage: 1,
        processor: 1,
        _id: 0
      })
      .sort({ assetTag: 1 }) // Sort by assetTag
      .toArray();

    console.log(`Found ${spareOrDeployedAssets.length} assets with status spare or deployed`);

    return res.status(200).json(spareOrDeployedAssets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    return res.status(500).json({
      error: "Failed to fetch assets from inventory collection.",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
