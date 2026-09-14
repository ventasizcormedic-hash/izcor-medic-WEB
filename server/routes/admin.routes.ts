import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.ts";
import { ScraperController } from "../controllers/scraper.controller.ts";
import { requireAuth } from "../../src/middleware/auth.ts";

const router = Router();

router.use(requireAuth);

router.get("/dashboard", AdminController.getDashboardStats);
router.get("/catalog/products", AdminController.getCatalogProducts);
router.patch("/catalog/products/:id/verification", AdminController.updateProductVerification);
router.delete("/catalog/products/:id", AdminController.deleteProduct);
router.get("/catalog/products/:id", AdminController.getProductDetail);
router.put("/catalog/products/:id", AdminController.updateProduct);
router.post("/catalog/products/bulk-action", AdminController.bulkAction);
router.post("/products/bulk", AdminController.bulkImport);

router.get("/manufacturers", AdminController.getManufacturers);
router.get("/brands/full", AdminController.getBrandsFull);
router.post("/brands", AdminController.saveBrand);
router.get("/categories/tree", AdminController.getCategoriesTree);
router.post("/categories", AdminController.saveCategory);

// Sources Administration API
router.get("/sources", ScraperController.getSources);
router.post("/sources", ScraperController.createSource);
router.get("/sources/:id", ScraperController.getSourceById);
router.put("/sources/:id", ScraperController.updateSource);
router.delete("/sources/:id", ScraperController.deleteSource);
router.post("/sources/:id/check", ScraperController.checkSource);
router.post("/sources/:id/extract", ScraperController.extractSource);

router.get("/audit/logs", AdminController.getAuditLogs);
router.get("/users", AdminController.getUsers);
router.patch("/users/:id/role", AdminController.updateUserRole);
router.get("/media/overview", AdminController.getMediaOverview);
router.get("/errors/overview", AdminController.getErrorsOverview);

router.get("/settings/maintenance", AdminController.getMaintenanceSettings);
router.post("/settings/maintenance", AdminController.updateMaintenanceSettings);

router.get("/global-search", AdminController.globalSearch);

export default router;
