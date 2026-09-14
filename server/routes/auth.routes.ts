import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.ts";
import { requireAuth } from "../../src/middleware/auth.ts";

const router = Router();

router.post("/auth/sync", requireAuth, AuthController.syncUser);

export default router;
