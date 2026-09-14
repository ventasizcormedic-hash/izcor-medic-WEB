import { Router } from "express";
import { QualityController } from "../controllers/quality.controller.ts";
import { requireAuth } from "../../src/middleware/auth.ts";

const router = Router();

router.use(requireAuth);

// Duplicates
router.get("/duplicates", QualityController.getDuplicates);
router.post("/duplicates/scan", QualityController.scanDuplicates);
router.post("/duplicates/merge", QualityController.mergeDuplicates);
router.patch("/duplicates/:id/status", QualityController.updateDuplicateStatus);

// Validation
router.get("/validation/products", QualityController.getValidationProducts);
router.post("/validation/run/:id", QualityController.runValidationForProduct);
router.post("/validation/run-all", QualityController.runMassValidation);
router.post("/validation/:id/verify", QualityController.verifyProductValidation);
router.post("/validation/:id/reject", QualityController.rejectProductValidation);

// Quality Audit & Incidents
router.get("/quality/audit", QualityController.getQualityAudit);
router.post("/quality/run-scan", QualityController.runQualityScan);
router.post("/quality/quick-fix/:id", QualityController.quickFixProduct);

// Review Center
router.get("/review/products", QualityController.getReviewProducts);
router.get("/review/products/:id", QualityController.getReviewProductDetail);
router.put("/review/products/:id", QualityController.updateReviewProduct);
router.patch("/review/products/:id/status", QualityController.updateReviewProductStatus);

export default router;
