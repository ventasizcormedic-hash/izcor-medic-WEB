import { Router } from "express";
import commercialRouter from "./commercial.routes.ts";
import catalogRouter from "./catalog.routes.ts";
import authRouter from "./auth.routes.ts";
import adminRouter from "./admin.routes.ts";
import scraperRouter from "./scraper.routes.ts";
import qualityRouter from "./quality.routes.ts";
import autonomousRouter from "./autonomous.routes.ts";
import seoRouter from "./seo.routes.ts";

export function registerRoutes(app: Router) {
  // Public SEO sitemaps & robots.txt (Root level)
  app.use("/", seoRouter);

  // Commercial / Lead gen endpoints (/api/quotes, /api/tdr, /api/contact, etc.)
  app.use("/api", commercialRouter);

  // Public Catalog & Search endpoints (/api/products, /api/categories, /api/brands, etc.)
  app.use("/api", catalogRouter);

  // Auth sync endpoints (/api/auth/sync)
  app.use("/api/auth", authRouter);

  // Admin management endpoints (/api/admin/*)
  app.use("/api/admin", adminRouter);
  app.use("/api/admin/scraper", scraperRouter);
  app.use("/api/admin", qualityRouter);
  app.use("/api/admin", autonomousRouter);
}

export {
  commercialRouter,
  catalogRouter,
  authRouter,
  adminRouter,
  scraperRouter,
  qualityRouter,
  autonomousRouter,
  seoRouter,
};
