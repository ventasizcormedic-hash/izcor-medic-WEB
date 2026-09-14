import { Response } from "express";
import { AuthRequest } from "../../src/middleware/auth.ts";
import { getOrCreateUser } from "../../src/db/users.ts";

export class AuthController {
  // Sync Authenticated User to Database
  static async syncUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await getOrCreateUser(
        req.user.uid,
        req.user.email || ""
      );

      res.json({ success: true, user });
    } catch (e: any) {
      console.error("Auth sync error:", e);
      res.status(500).json({ error: e.message || "Failed to sync user" });
    }
  }
}
