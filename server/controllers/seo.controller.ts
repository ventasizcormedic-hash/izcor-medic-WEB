import { Request, Response } from "express";
import { db } from "../../src/db/index.ts";
import { products, categories, brands } from "../../src/db/schema.ts";
import { eq, and, sql } from "drizzle-orm";

export class SeoController {
  // robots.txt
  static async getRobots(req: Request, res: Response) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*?*q=
Disallow: /*?*search=
Disallow: /*?*filter=
Disallow: /*?*sort=

Sitemap: ${baseUrl}/sitemap.xml`);
  }

  // Sitemap Index
  static async getSitemapIndex(req: Request, res: Response) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${baseUrl}/sitemaps/products.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemaps/categories.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemaps/brands.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemaps/manufacturers.xml</loc></sitemap>
</sitemapindex>`);
  }

  // Products Sitemap
  static async getProductsSitemap(req: Request, res: Response) {
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const publishedProducts = await db
        .select({ slug: products.slug, updatedAt: products.updatedAt })
        .from(products)
        .where(eq(products.publicationStatus, "PUBLISHED"))
        .limit(45000);

      const urls = publishedProducts.map(p => {
        const lastMod = p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString();
        return `  <url>
    <loc>${baseUrl}/producto/${p.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }).join("\n");

      res.type("application/xml");
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
    } catch (e) {
      console.error("Sitemap generation error:", e);
      res.status(500).end();
    }
  }

  // Categories Sitemap
  static async getCategoriesSitemap(req: Request, res: Response) {
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const activeCategories = await db.select({ slug: categories.slug }).from(categories);

      const urls = activeCategories.map(c => `  <url>
    <loc>${baseUrl}/categorias/${c.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join("\n");

      res.type("application/xml");
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
    } catch (e) {
      console.error("Sitemap generation error:", e);
      res.status(500).end();
    }
  }

  // Brands Sitemap
  static async getBrandsSitemap(req: Request, res: Response) {
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const activeBrands = await db.select({ slug: brands.slug }).from(brands);

      const urls = activeBrands.map(b => `  <url>
    <loc>${baseUrl}/marcas/${b.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n");

      res.type("application/xml");
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
    } catch (e) {
      console.error("Sitemap generation error:", e);
      res.status(500).end();
    }
  }

  // Manufacturers Sitemap
  static async getManufacturersSitemap(req: Request, res: Response) {
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const uniqueMfgs = await db
        .select({ manufacturer: products.manufacturer })
        .from(products)
        .where(
          and(
            eq(products.publicationStatus, "PUBLISHED"),
            sql`${products.manufacturer} IS NOT NULL`
          )
        )
        .groupBy(products.manufacturer);

      const urls = uniqueMfgs.filter(m => m.manufacturer).map(m => `  <url>
    <loc>${baseUrl}/fabricantes/${encodeURIComponent(m.manufacturer as string)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n");

      res.type("application/xml");
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
    } catch (e) {
      console.error("Sitemap generation error:", e);
      res.status(500).end();
    }
  }
}
