import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();

  if (req.method === "GET") {
    const userId = req.query.id as string;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    try {
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      if (!user) return res.status(404).json({ error: "User not found" });

      const { password, ...userData } = user;
      return res.status(200).json(userData); // includes user.role if it exists
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Invalid ID format or server error" });
    }
  }

  if (req.method === "PUT") {
    const { id, Firstname, Lastname, Email, profilePicture } = req.body;
    if (!id) return res.status(400).json({ error: "User ID is required" });

    try {
      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            Firstname,
            Lastname,
            Email,
            profilePicture,
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0)
        return res.status(404).json({ error: "User not found or no changes made" });

      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Error updating user" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
