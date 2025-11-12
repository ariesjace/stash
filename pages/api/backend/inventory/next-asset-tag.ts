import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

interface AssetTagCounter {
  _id: string;
  sequence: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { assetType } = req.body;

  if (!assetType) {
    return res.status(400).json({ error: "Asset type is required" });
  }

  try {
    const db = await connectToDatabase();
    const inventoryCollection = db.collection("inventory");

    const prefix = assetType.toLowerCase().slice(0, 3).toUpperCase();
    const year = new Date().getFullYear();

    // Search for existing assets with this prefix and year
    const searchPattern = `^${prefix}-${year}-`;
    const existingAssets = await inventoryCollection
      .find({
        assetTag: { $regex: searchPattern, $options: "i" },
      })
      .toArray();

    // Find the highest number
    let maxNumber = 0;
    for (const asset of existingAssets) {
      const tag = asset.assetTag || "";
      const parts = tag.split("-");
      if (parts.length === 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    }

    // Generate the next number
    const nextNumber = (maxNumber + 1).toString().padStart(3, "0");
    const assetTag = `${prefix}-${year}-${nextNumber}`;

    return res.status(200).json({ assetTag });
  } catch (error: any) {
    console.error("Error generating asset tag:", error);
    return res.status(500).json({ error: error.message || "Failed to generate asset tag" });
  }
}