import { Router } from "express";
import { ScraperController } from "../controllers/scraper.controller.ts";
import { requireAuth } from "../../src/middleware/auth.ts";

const router = Router();

router.use(requireAuth);

router.post("/consolidate", ScraperController.consolidateProducts);
router.post("/run", ScraperController.runScraper);

router.get("/urls", ScraperController.getScraperUrls);
router.post("/urls", ScraperController.createScraperUrl);
router.put("/urls/:id", ScraperController.updateScraperUrl);
router.delete("/urls/:id", ScraperController.deleteScraperUrl);
router.post("/urls/:id/validate", ScraperController.validateScraperUrl);

router.get("/jobs", ScraperController.getScraperJobs);
router.post("/jobs", ScraperController.createScraperJob);

router.get("/drafts", ScraperController.getDrafts);
router.put("/drafts/:id", ScraperController.updateDraft);
router.post("/drafts/:id/approve", ScraperController.approveDraft);
router.post("/drafts/:id/reject", ScraperController.rejectDraft);
router.post("/drafts/:id/publish", ScraperController.publishDraft);

export default router;
