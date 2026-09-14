import { Router } from "express";
import { SeoController } from "../controllers/seo.controller.ts";

const router = Router();

router.get("/robots.txt", SeoController.getRobots);
router.get("/sitemap.xml", SeoController.getSitemapIndex);
router.get("/sitemaps/products.xml", SeoController.getProductsSitemap);
router.get("/sitemaps/categories.xml", SeoController.getCategoriesSitemap);
router.get("/sitemaps/brands.xml", SeoController.getBrandsSitemap);
router.get("/sitemaps/manufacturers.xml", SeoController.getManufacturersSitemap);

export default router;
