import { Router } from "express";
import { CommercialController } from "../controllers/commercial.controller.ts";
import { requireAuth } from "../../src/middleware/auth.ts";

const router = Router();

// Public Commercial Routes
router.post("/quotes", CommercialController.submitQuote);
router.post("/tdr", CommercialController.submitTdr);
router.post("/contact", CommercialController.submitContact);
router.post("/pharmacovigilance", CommercialController.submitPharmacovigilance);
router.post("/ai/analyze-tdr", CommercialController.analyzeTdr);

// Admin Commercial Routes
router.get("/admin/quotes", requireAuth, CommercialController.getAdminQuotes);
router.patch("/admin/quotes/:id/status", requireAuth, CommercialController.updateQuoteStatus);
router.get("/admin/tdr", requireAuth, CommercialController.getAdminTdr);
router.patch("/admin/tdr/:id/status", requireAuth, CommercialController.updateTdrStatus);
router.get("/admin/pharmacovigilance", requireAuth, CommercialController.getAdminPharmacovigilance);

export default router;
