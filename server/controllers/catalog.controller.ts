import { Request, Response } from "express";
import { db } from "../../src/db/index.ts";
import { categories, products, brands, productImages, productDocuments } from "../../src/db/schema.ts";
import { eq, ilike, or, and, desc, asc, sql, inArray } from "drizzle-orm";
import { cacheEngine } from "../../src/services/cacheEngine.ts";
import { expandClinicalQuery } from "../../src/services/clinicalSearchService.ts";

export class CatalogController {
  // Public Category List
  static async getCategories(req: Request, res: Response) {
    try {
      const result = await db.select().from(categories).orderBy(categories.name);
      res.json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  }

  // Category Public Details & Aggregations
  static async getCategoryDetails(req: Request, res: Response) {
    try {
      const slug = req.params.slug;
      
      const categoryResult = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
      if (categoryResult.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      const category = categoryResult[0];

      let parentCategory = null;
      if (category.parentId) {
        const parentResult = await db.select().from(categories).where(eq(categories.id, category.parentId)).limit(1);
        if (parentResult.length > 0) parentCategory = parentResult[0];
      }

      const subcategories = await db.select().from(categories).where(eq(categories.parentId, category.id)).orderBy(categories.name);
      
      // We want to count only published products for the category and its subcategories
      const categoryIds = [category.id, ...subcategories.map(s => s.id)];

      // Featured products
      const featuredProducts = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          model: products.model,
          catalogNumber: products.catalogNumber,
          manufacturer: products.manufacturer,
          brandName: brands.name,
          categoryName: categories.name,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          and(
            inArray(products.categoryId, categoryIds),
            eq(products.publicationStatus, "PUBLISHED"),
            eq(products.featured, true)
          )
        )
        .limit(4);

      if (featuredProducts.length > 0) {
        const featuredIds = featuredProducts.map(p => p.id);
        const imagesResult = await db.select().from(productImages).where(inArray(productImages.productId, featuredIds));
        
        featuredProducts.forEach((p: any) => {
          p.images = imagesResult.filter(img => img.productId === p.id).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        });
      }

      // Facets (Manufacturers and Brands in this category)
      const facetsQuery = await db
        .select({
          brandId: products.brandId,
          brandName: brands.name,
          manufacturer: products.manufacturer,
          brandManufacturer: brands.manufacturer,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .where(
          and(
            inArray(products.categoryId, categoryIds),
            eq(products.publicationStatus, "PUBLISHED")
          )
        );

      let totalProducts = 0;
      const brandMap = new Map<number, { id: number; name: string; count: number }>();
      const manufacturerMap = new Map<string, { name: string; count: number }>();

      facetsQuery.forEach(p => {
        totalProducts++;
        if (p.brandId && p.brandName) {
          if (!brandMap.has(p.brandId)) {
            brandMap.set(p.brandId, { id: p.brandId, name: p.brandName, count: 0 });
          }
          brandMap.get(p.brandId)!.count++;
        }
        
        const mfg = p.manufacturer || p.brandManufacturer;
        if (mfg && mfg.trim()) {
          const key = mfg.trim();
          if (!manufacturerMap.has(key)) {
            manufacturerMap.set(key, { name: key, count: 0 });
          }
          manufacturerMap.get(key)!.count++;
        }
      });

      const relatedBrands = Array.from(brandMap.values()).sort((a, b) => b.count - a.count).slice(0, 20);
      const relatedManufacturers = Array.from(manufacturerMap.values()).sort((a, b) => b.count - a.count).slice(0, 20);

      // Subcategory counts
      const subcatsWithCount = subcategories.map(s => {
        return { ...s, productCount: 0 };
      });
      
      const subcatsCounts = await db
        .select({ categoryId: products.categoryId, count: sql<number>`count(*)::int` })
        .from(products)
        .where(and(inArray(products.categoryId, subcategories.map(s => s.id)), eq(products.publicationStatus, "PUBLISHED")))
        .groupBy(products.categoryId);

      subcatsWithCount.forEach(s => {
        const row = subcatsCounts.find(r => r.categoryId === s.id);
        s.productCount = row ? row.count : 0;
      });

      res.json({
        category,
        parentCategory,
        subcategories: subcatsWithCount,
        featuredProducts,
        totalProducts,
        relatedBrands,
        relatedManufacturers,
      });

    } catch (e) {
      console.error("Category detail error:", e);
      res.status(500).json({ error: "Failed to fetch category details" });
    }
  }

  // Category Products
  static async getCategoryProducts(req: Request, res: Response) {
    try {
      const slug = req.params.slug;
      const { q, brandId, manufacturer, sort = "recent", page = 1, limit = 24 } = req.query;
      
      const categoryResult = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
      if (categoryResult.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      const category = categoryResult[0];
      const subcategories = await db.select().from(categories).where(eq(categories.parentId, category.id));
      const categoryIds = [category.id, ...subcategories.map(s => s.id)];

      const pageNum = Math.max(1, parseInt(String(page), 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 24));
      const offset = (pageNum - 1) * limitNum;

      let conditions = [
        inArray(products.categoryId, categoryIds),
        eq(products.publicationStatus, "PUBLISHED")
      ];

      if (q) {
        const searchTerm = `%${String(q).trim()}%`;
        conditions.push(or(
          ilike(products.name, searchTerm),
          ilike(products.model, searchTerm),
          ilike(products.catalogNumber, searchTerm)
        ));
      }

      if (brandId) {
        conditions.push(eq(products.brandId, Number(brandId)));
      }

      if (manufacturer) {
        conditions.push(or(
          ilike(products.manufacturer, String(manufacturer)),
          ilike(brands.manufacturer, String(manufacturer))
        ));
      }

      let orderByArg = desc(products.createdAt);
      if (sort === "name-asc") orderByArg = asc(products.name);
      if (sort === "name-desc") orderByArg = desc(products.name);

      const totalResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .where(and(...conditions));

      const total = totalResult[0]?.count || 0;

      const productList = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          model: products.model,
          catalogNumber: products.catalogNumber,
          manufacturer: products.manufacturer,
          brandName: brands.name,
          brandLogo: brands.logo,
          categoryName: categories.name,
          description: products.description,
          status: products.status,
          createdAt: products.createdAt,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(orderByArg)
        .limit(limitNum)
        .offset(offset);

      const productIds = productList.map(p => p.id);
      let imagesMap: Record<number, any[]> = {};
      
      if (productIds.length > 0) {
        const imagesResult = await db.select().from(productImages).where(inArray(productImages.productId, productIds));
        imagesResult.forEach(img => {
          if (!imagesMap[img.productId]) imagesMap[img.productId] = [];
          imagesMap[img.productId].push(img);
        });
      }

      const productsWithImages = productList.map(p => ({
        ...p,
        images: (imagesMap[p.id] || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
      }));

      res.json({
        total,
        page: pageNum,
        limit: limitNum,
        products: productsWithImages,
      });

    } catch (e) {
      console.error("Category products error:", e);
      res.status(500).json({ error: "Failed to fetch category products" });
    }
  }

  // Facets for scalable filtering
  static async getFacets(req: Request, res: Response) {
    try {
      const allCategories = await db.select().from(categories).orderBy(categories.name);
      const allBrands = await db.select().from(brands).orderBy(brands.name);

      // Get count of products per category
      const categoryCounts = await db
        .select({
          categoryId: products.categoryId,
          count: sql<number>`count(*)::int`,
        })
        .from(products)
        .where(eq(products.publicationStatus, "PUBLISHED"))
        .groupBy(products.categoryId);

      const categoryCountMap = new Map<number, number>();
      categoryCounts.forEach((c) => {
        if (c.categoryId) categoryCountMap.set(c.categoryId, c.count);
      });

      // Get count of products per brand
      const brandCounts = await db
        .select({
          brandId: products.brandId,
          count: sql<number>`count(*)::int`,
        })
        .from(products)
        .where(eq(products.publicationStatus, "PUBLISHED"))
        .groupBy(products.brandId);

      const brandCountMap = new Map<number, number>();
      brandCounts.forEach((b) => {
        if (b.brandId) brandCountMap.set(b.brandId, b.count);
      });

      // Distinct manufacturers
      const manufacturersResult = await db
        .select({
          manufacturer: sql<string>`COALESCE(${products.manufacturer}, ${brands.manufacturer})`,
          count: sql<number>`count(*)::int`,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .where(
          and(
            eq(products.publicationStatus, "PUBLISHED"),
            sql`COALESCE(${products.manufacturer}, ${brands.manufacturer}) IS NOT NULL`
          )
        )
        .groupBy(sql`COALESCE(${products.manufacturer}, ${brands.manufacturer})`)
        .orderBy(sql`COALESCE(${products.manufacturer}, ${brands.manufacturer})`);

      // Tree of categories: parent -> subcategories
      const parentCategories = allCategories
        .filter((c) => !c.parentId)
        .map((parent) => {
          const subs = allCategories.filter((child) => child.parentId === parent.id);
          const totalProducts = (categoryCountMap.get(parent.id) || 0) + 
            subs.reduce((acc, s) => acc + (categoryCountMap.get(s.id) || 0), 0);
          return {
            ...parent,
            productCount: totalProducts,
            subcategories: subs.map((s) => ({
              ...s,
              productCount: categoryCountMap.get(s.id) || 0,
            })),
          };
        });

      const clinicalApplications = [
        "Cuidados Intensivos (UCI)",
        "Quirófano y Cirugía",
        "Emergencias y Trauma",
        "Hemodiálisis y Nefrología",
        "Diagnóstico y Ultrasonido",
        "Hospitalización General",
        "Laboratorio y Patología",
        "Esterilización y Bioseguridad",
        "Pediatría y Neonatología",
      ];

      const totalResult = await db.select({ count: sql<number>`count(*)::int` }).from(products).where(eq(products.publicationStatus, "PUBLISHED"));

      const procedenciasResult = await db.execute(sql`
        SELECT 
          TRIM(REPLACE(technical_specs, 'Procedencia: ', '')) as procedencia,
          COUNT(*)::int as count
        FROM products
        WHERE publication_status = 'PUBLISHED'
          AND technical_specs IS NOT NULL
          AND technical_specs LIKE 'Procedencia:%'
        GROUP BY TRIM(REPLACE(technical_specs, 'Procedencia: ', ''))
        ORDER BY count DESC
      `);
      const procedencias = (procedenciasResult.rows as any[])
        .filter(r => r.procedencia && r.procedencia.trim())
        .map(r => ({ procedencia: r.procedencia.trim(), count: r.count }));

      res.json({
        totalProducts: totalResult[0]?.count || 0,
        categories: parentCategories,
        allCategories,
        brands: allBrands.map((b) => ({
          ...b,
          productCount: brandCountMap.get(b.id) || 0,
        })),
        manufacturers: manufacturersResult.filter((m) => Boolean(m.manufacturer)),
        clinicalApplications,
        procedencias,
      });
    } catch (e) {
      console.error("Facets error:", e);
      res.status(500).json({ error: "Failed to fetch catalog facets" });
    }
  }

  // Suggestions API
  static async getSearchSuggestions(req: Request, res: Response) {
    try {
      const q = String(req.query.q || "").trim();
      if (!q || q.length < 2) {
        return res.json({ products: [], brands: [], categories: [], manufacturers: [], models: [] });
      }

      const cacheKey = `suggestions:${q.toLowerCase()}`;
      const cached = cacheEngine.get<any>(cacheKey);
      if (cached) {
        res.setHeader("Cache-Control", "public, max-age=180");
        res.setHeader("X-Cache-Status", "HIT");
        return res.json(cached.value);
      }

      const queryPattern = `%${q}%`;

      const matchedProducts = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          model: products.model,
          catalogNumber: products.catalogNumber,
          brandName: brands.name,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .where(
          and(
            eq(products.publicationStatus, "PUBLISHED"),
            or(
              ilike(products.name, queryPattern),
              ilike(products.model, queryPattern),
              ilike(products.catalogNumber, queryPattern),
              ilike(products.description, queryPattern),
              ilike(products.technicalSpecs, queryPattern),
              ilike(products.application, queryPattern),
              ilike(products.manufacturer, queryPattern)
            )
          )
        )
        .limit(6);

      const matchedBrands = await db
        .select({
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
        })
        .from(brands)
        .where(ilike(brands.name, queryPattern))
        .limit(4);

      const matchedCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(categories)
        .where(ilike(categories.name, queryPattern))
        .limit(4);

      const matchedManufacturers = await db
        .select({
          manufacturer: products.manufacturer,
        })
        .from(products)
        .where(
          and(
            eq(products.publicationStatus, "PUBLISHED"),
            ilike(products.manufacturer, queryPattern)
          )
        )
        .limit(4);

      const uniqueManufacturers = Array.from(new Set(matchedManufacturers.map(m => m.manufacturer).filter(Boolean)));

      const matchedModels = await db
        .select({
          model: products.model,
          productId: products.id,
          productSlug: products.slug,
          productName: products.name,
        })
        .from(products)
        .where(
          and(
            eq(products.publicationStatus, "PUBLISHED"),
            ilike(products.model, queryPattern)
          )
        )
        .limit(5);

      const clinicalAnalysis = expandClinicalQuery(q);
      let enrichedProducts = [...matchedProducts];
      const foundProductIds = new Set(matchedProducts.map(p => p.id));

      if (enrichedProducts.length < 6 && clinicalAnalysis.expandedTerms.length > 1) {
        for (const term of clinicalAnalysis.expandedTerms) {
          if (enrichedProducts.length >= 6) break;
          if (term === q.toLowerCase()) continue;
          
          const synonymPattern = `%${term}%`;
          const synProducts = await db
            .select({
              id: products.id,
              name: products.name,
              slug: products.slug,
              model: products.model,
              catalogNumber: products.catalogNumber,
              brandName: brands.name,
            })
            .from(products)
            .leftJoin(brands, eq(products.brandId, brands.id))
            .where(
              and(
                eq(products.publicationStatus, "PUBLISHED"),
                or(
                  ilike(products.name, synonymPattern),
                  ilike(products.model, synonymPattern),
                  ilike(products.catalogNumber, synonymPattern),
                  ilike(products.description, synonymPattern),
                  ilike(products.technicalSpecs, synonymPattern),
                  ilike(products.application, synonymPattern),
                  ilike(products.manufacturer, synonymPattern)
                )
              )
            )
            .limit(6 - enrichedProducts.length);

          for (const sp of synProducts) {
            if (!foundProductIds.has(sp.id)) {
              foundProductIds.add(sp.id);
              enrichedProducts.push(sp);
            }
          }
        }
      }

      const suggestionsPayload = {
        products: enrichedProducts,
        brands: matchedBrands,
        categories: matchedCategories,
        manufacturers: uniqueManufacturers,
        models: matchedModels,
        suggestedCorrection: clinicalAnalysis.suggestedCorrection || null,
        expandedTerms: clinicalAnalysis.expandedTerms.filter(t => t !== q.toLowerCase()),
      };

      cacheEngine.set(cacheKey, suggestionsPayload, 180, ["search", "products"]);
      res.setHeader("Cache-Control", "public, max-age=180");
      res.setHeader("X-Cache-Status", "MISS");

      res.json(suggestionsPayload);
    } catch (e) {
      console.error("Suggestions error:", e);
      res.status(500).json({ error: "Failed to fetch search suggestions" });
    }
  }

  // Autocomplete API
  static async getAutocomplete(req: Request, res: Response) {
    try {
      const q = String(req.query.q || "").trim();
      if (!q || q.length < 2) {
        return res.json([]);
      }

      const cacheKey = `autocomplete:${q.toLowerCase()}`;
      const cached = cacheEngine.get<any[]>(cacheKey);
      if (cached) {
        res.setHeader("Cache-Control", "public, max-age=300");
        res.setHeader("X-Cache-Status", "HIT");
        return res.json(cached.value);
      }

      const pattern = `%${q}%`;
      const results = await db
        .select({
          id: products.id,
          name: products.name,
          model: products.model,
          catalogNumber: products.catalogNumber,
          slug: products.slug,
          manufacturer: products.manufacturer,
          brandName: brands.name,
          categoryName: categories.name,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(or(
          ilike(products.name, pattern),
          ilike(products.model, pattern),
          ilike(products.catalogNumber, pattern),
          ilike(brands.name, pattern)
        ))
        .limit(8);

      const pIds = results.map(r => r.id);
      const imgMap = new Map<number, string>();
      if (pIds.length > 0) {
        const imgs = await db
          .select({ productId: productImages.productId, url: productImages.url })
          .from(productImages)
          .where(inArray(productImages.productId, pIds));
        for (const img of imgs) {
          if (!imgMap.has(img.productId)) {
            imgMap.set(img.productId, img.url);
          }
        }
      }

      const formatted = results.map(r => ({
        ...r,
        imageUrl: imgMap.get(r.id) || null,
      }));

      cacheEngine.set(cacheKey, formatted, 300, ["products", "search"]);
      res.setHeader("Cache-Control", "public, max-age=300");
      res.setHeader("X-Cache-Status", "MISS");
      res.json(formatted);
    } catch (e) {
      console.error("Autocomplete search failed:", e);
      res.status(500).json({ error: "Autocomplete search failed" });
    }
  }

  // Manufacturers Directory
  static async getManufacturers(req: Request, res: Response) {
    try {
      const { search, page = 1, limit = 24 } = req.query;
      const pageNum = Math.max(1, parseInt(String(page), 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 24));
      
      const allProds = await db
        .select({
          manufacturer: products.manufacturer,
          brandManufacturer: brands.manufacturer,
          brandName: brands.name,
          categoryId: products.categoryId,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id));

      const mfgMap = new Map<string, {
        name: string;
        productCount: number;
        brandsSet: Set<string>;
        categoriesSet: Set<number>;
      }>();

      allProds.forEach(p => {
        const mfgName = p.manufacturer || p.brandManufacturer;
        if (mfgName && mfgName.trim()) {
          const key = mfgName.trim();
          if (!mfgMap.has(key)) {
            mfgMap.set(key, {
              name: key,
              productCount: 0,
              brandsSet: new Set<string>(),
              categoriesSet: new Set<number>(),
            });
          }
          const item = mfgMap.get(key)!;
          item.productCount += 1;
          if (p.brandName) item.brandsSet.add(p.brandName);
          if (p.categoryId) item.categoriesSet.add(p.categoryId);
        }
      });

      const allBrandsList = await db.select().from(brands);
      allBrandsList.forEach(b => {
        if (b.manufacturer && b.manufacturer.trim()) {
          const key = b.manufacturer.trim();
          if (!mfgMap.has(key)) {
            mfgMap.set(key, {
              name: key,
              productCount: 0,
              brandsSet: new Set<string>(),
              categoriesSet: new Set<number>(),
            });
          }
          if (b.name) mfgMap.get(key)!.brandsSet.add(b.name);
        }
      });

      let manufacturersList = Array.from(mfgMap.values()).map(m => ({
        id: encodeURIComponent(m.name),
        name: m.name,
        slug: m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        productCount: m.productCount,
        brandCount: m.brandsSet.size,
        brands: Array.from(m.brandsSet),
        categoryCount: m.categoriesSet.size,
        informationStatus: m.productCount > 5 ? "INFORMACIÓN VERIFICADA" : "INFORMACIÓN PARCIAL",
        peruPresenceStatus: "PRESENTE EN PERÚ (CATÁLOGO)",
        source: "Catálogo Oficial IZCOR / Registros de Suministro Médico",
        updatedAt: new Date().toISOString(),
      }));

      if (search) {
        const s = String(search).toLowerCase();
        manufacturersList = manufacturersList.filter(m => 
          m.name.toLowerCase().includes(s) || 
          m.brands.some(b => b.toLowerCase().includes(s))
        );
      }

      manufacturersList.sort((a, b) => b.productCount - a.productCount);

      const total = manufacturersList.length;
      const paginated = manufacturersList.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      res.json({
        total,
        page: pageNum,
        limit: limitNum,
        manufacturers: paginated,
      });
    } catch (e) {
      console.error("Manufacturers API error:", e);
      res.status(500).json({ error: "Failed to fetch manufacturers" });
    }
  }

  // Manufacturer Detail
  static async getManufacturerDetail(req: Request, res: Response) {
    try {
      const rawParam = decodeURIComponent(req.params.nameOrSlug);
      const { search, category, brand, page = 1, limit = 24 } = req.query;
      const pageNum = Math.max(1, parseInt(String(page), 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 24));
      const offset = (pageNum - 1) * limitNum;

      let conditions: any[] = [
        or(
          ilike(products.manufacturer, rawParam),
          ilike(brands.manufacturer, rawParam)
        )
      ];

      if (search) {
        const q = `%${String(search).trim()}%`;
        conditions.push(or(
          ilike(products.name, q),
          ilike(products.model, q),
          ilike(products.catalogNumber, q)
        ));
      }

      if (category) {
        const catNum = Number(category);
        if (!isNaN(catNum)) {
          conditions.push(eq(products.categoryId, catNum));
        }
      }

      if (brand) {
        const brandNum = Number(brand);
        if (!isNaN(brandNum)) {
          conditions.push(eq(products.brandId, brandNum));
        }
      }

      const totalResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .where(and(...conditions));

      const total = totalResult[0]?.count || 0;

      const productList = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          model: products.model,
          catalogNumber: products.catalogNumber,
          manufacturer: products.manufacturer,
          brandId: products.brandId,
          brandName: brands.name,
          brandLogo: brands.logo,
          categoryId: products.categoryId,
          categoryName: categories.name,
          description: products.description,
          verificationStatus: products.verificationStatus,
          status: products.status,
          createdAt: products.createdAt,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(desc(products.id))
        .limit(limitNum)
        .offset(offset);

      const productIds = productList.map(p => p.id);
      let imagesMap: Record<number, Array<{ id: number; url: string; altText?: string | null }>> = {};
      if (productIds.length > 0) {
        const imgs = await db
          .select({
            id: productImages.id,
            productId: productImages.productId,
            url: productImages.url,
            altText: productImages.altText,
          })
          .from(productImages)
          .where(inArray(productImages.productId, productIds));

        imgs.forEach(img => {
          if (!imagesMap[img.productId]) imagesMap[img.productId] = [];
          imagesMap[img.productId].push(img);
        });
      }

      const enrichedProducts = productList.map(p => ({
        ...p,
        images: imagesMap[p.id] || [],
      }));

      const mfgBrands = await db
        .select({
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          logo: brands.logo,
          website: brands.website,
        })
        .from(brands)
        .where(ilike(brands.manufacturer, rawParam));

      res.json({
        manufacturer: {
          name: rawParam,
          slug: rawParam.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          informationStatus: total > 5 ? "INFORMACIÓN VERIFICADA" : "INFORMACIÓN PARCIAL",
          peruPresenceStatus: "PRESENTE EN PERÚ (CATÁLOGO OFICIAL)",
          source: "Catálogo Oficial de Suministro Médico IZCOR",
          brands: mfgBrands,
          totalProducts: total,
        },
        products: enrichedProducts,
        total,
        page: pageNum,
        limit: limitNum,
      });
    } catch (e) {
      console.error("Manufacturer detail API error:", e);
      res.status(500).json({ error: "Failed to fetch manufacturer details" });
    }
  }

  // Brands Directory
  static async getBrands(req: Request, res: Response) {
    try {
      const { search, page = 1, limit = 24 } = req.query;
      const pageNum = Math.max(1, parseInt(String(page), 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 24));
      const offset = (pageNum - 1) * limitNum;

      let conditions: any[] = [];
      if (search) {
        const q = `%${String(search).trim()}%`;
        conditions.push(or(
          ilike(brands.name, q),
          ilike(brands.manufacturer, q),
          ilike(brands.description, q)
        ));
      }

      const totalResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(brands)
        .where(conditions.length ? and(...conditions) : undefined);

      const total = totalResult[0]?.count || 0;

      const brandList = await db
        .select({
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          manufacturer: brands.manufacturer,
          logo: brands.logo,
          website: brands.website,
          description: brands.description,
          sourceUrl: brands.sourceUrl,
          status: brands.status,
        })
        .from(brands)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(asc(brands.name))
        .limit(limitNum)
        .offset(offset);

      const brandCounts = await db
        .select({
          brandId: products.brandId,
          count: sql<number>`count(*)::int`,
        })
        .from(products)
        .groupBy(products.brandId);

      const brandCountMap = new Map<number, number>();
      brandCounts.forEach(b => {
        if (b.brandId) brandCountMap.set(b.brandId, b.count);
      });

      const enrichedBrands = brandList.map(b => ({
        ...b,
        productCount: brandCountMap.get(b.id) || 0,
        informationStatus: b.description ? "INFORMACIÓN VERIFICADA" : "INFORMACIÓN PARCIAL",
        peruPresenceStatus: "PRESENTE EN PERÚ (CATÁLOGO)",
      }));

      res.json({
        total,
        page: pageNum,
        limit: limitNum,
        brands: enrichedBrands,
      });
    } catch (e) {
      console.error("Brands API error:", e);
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  }

  // Brand Detail
  static async getBrandDetail(req: Request, res: Response) {
    try {
      const param = req.params.idOrSlug;
      const isNum = !isNaN(Number(param));

      const brandResult = await db
        .select()
        .from(brands)
        .where(isNum ? eq(brands.id, Number(param)) : eq(brands.slug, param))
        .limit(1);

      if (brandResult.length === 0) {
        return res.status(404).json({ error: "Brand not found" });
      }

      const brand = brandResult[0];

      const { search, category, page = 1, limit = 24 } = req.query;
      const pageNum = Math.max(1, parseInt(String(page), 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 24));
      const offset = (pageNum - 1) * limitNum;

      let conditions: any[] = [eq(products.brandId, brand.id)];
      if (search) {
        const q = `%${String(search).trim()}%`;
        conditions.push(or(
          ilike(products.name, q),
          ilike(products.model, q),
          ilike(products.catalogNumber, q)
        ));
      }
      if (category) {
        const catNum = Number(category);
        if (!isNaN(catNum)) conditions.push(eq(products.categoryId, catNum));
      }

      const totalResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(and(...conditions));

      const total = totalResult[0]?.count || 0;

      const productList = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          model: products.model,
          catalogNumber: products.catalogNumber,
          manufacturer: products.manufacturer,
          brandId: products.brandId,
          brandName: brands.name,
          brandLogo: brands.logo,
          categoryId: products.categoryId,
          categoryName: categories.name,
          description: products.description,
          verificationStatus: products.verificationStatus,
          status: products.status,
          createdAt: products.createdAt,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(desc(products.id))
        .limit(limitNum)
        .offset(offset);

      const productIds = productList.map(p => p.id);
      let imagesMap: Record<number, Array<{ id: number; url: string; altText?: string | null }>> = {};
      if (productIds.length > 0) {
        const imgs = await db
          .select({
            id: productImages.id,
            productId: productImages.productId,
            url: productImages.url,
            altText: productImages.altText,
          })
          .from(productImages)
          .where(inArray(productImages.productId, productIds));

        imgs.forEach(img => {
          if (!imagesMap[img.productId]) imagesMap[img.productId] = [];
          imagesMap[img.productId].push(img);
        });
      }

      const enrichedProducts = productList.map(p => ({
        ...p,
        images: imagesMap[p.id] || [],
      }));

      res.json({
        brand: {
          ...brand,
          productCount: total,
          informationStatus: brand.description ? "INFORMACIÓN VERIFICADA" : "INFORMACIÓN PARCIAL",
          peruPresenceStatus: "PRESENTE EN PERÚ (CATÁLOGO)",
        },
        products: enrichedProducts,
        total,
        page: pageNum,
        limit: limitNum,
      });
    } catch (e) {
      console.error("Brand detail API error:", e);
      res.status(500).json({ error: "Failed to fetch brand details" });
    }
  }

  // Scalable Products API
  static async getProducts(req: Request, res: Response) {
    try {
      const cacheKey = `products:${req.originalUrl || req.url}`;
      const cached = cacheEngine.get<any>(cacheKey);
      if (cached) {
        res.setHeader("ETag", cached.etag);
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
        res.setHeader("X-Cache-Status", "HIT");
        if (req.headers["if-none-match"] === cached.etag) {
          return res.status(304).end();
        }
        return res.json(cached.value);
      }

      const { 
        search, 
        category, 
        subcategory,
        brand, 
        manufacturer, 
        application,
        verificationStatus,
        sort = "recent",
        page,
        limit = 24,
        format,
        procedencia,
      } = req.query;

      const pageNum = Math.max(1, parseInt(String(page || 1), 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 24));
      const offset = (pageNum - 1) * limitNum;

      let conditions: any[] = [];
      
      if (search) {
        const query = `%${String(search).trim()}%`;
        conditions.push(or(
          ilike(products.name, query),
          ilike(products.model, query),
          ilike(products.catalogNumber, query),
          ilike(products.manufacturer, query),
          ilike(products.description, query),
          ilike(products.technicalSpecs, query),
          ilike(products.application, query),
          ilike(brands.name, query),
          ilike(categories.name, query)
        ));
      }

      if (procedencia) {
        const procQuery = `%${String(procedencia).trim()}%`;
        conditions.push(ilike(products.technicalSpecs, procQuery));
      }
      
      if (category) {
        const catVal = String(category);
        const catNum = Number(catVal);
        if (!isNaN(catNum)) {
          const childCats = await db.select({ id: categories.id }).from(categories).where(eq(categories.parentId, catNum));
          if (childCats.length > 0) {
            const catIds = [catNum, ...childCats.map(c => c.id)];
            conditions.push(or(
              inArray(products.categoryId, catIds),
              inArray(products.subcategoryId, catIds)
            ));
          } else {
            conditions.push(or(
              eq(products.categoryId, catNum),
              eq(products.subcategoryId, catNum)
            ));
          }
        } else {
          const cat = await db.select().from(categories).where(eq(categories.slug, catVal)).limit(1);
          if (cat.length > 0) {
            const catId = cat[0].id;
            const childCats = await db.select({ id: categories.id }).from(categories).where(eq(categories.parentId, catId));
            const catIds = [catId, ...childCats.map(c => c.id)];
            conditions.push(or(
              inArray(products.categoryId, catIds),
              inArray(products.subcategoryId, catIds)
            ));
          }
        }
      }

      if (subcategory) {
        const subVal = String(subcategory);
        const subNum = Number(subVal);
        if (!isNaN(subNum)) {
          conditions.push(or(
            eq(products.subcategoryId, subNum),
            eq(products.categoryId, subNum)
          ));
        } else {
          const sub = await db.select().from(categories).where(eq(categories.slug, subVal)).limit(1);
          if (sub.length > 0) {
            conditions.push(or(
              eq(products.subcategoryId, sub[0].id),
              eq(products.categoryId, sub[0].id)
            ));
          }
        }
      }
      
      if (brand) {
        const brandVal = String(brand);
        const brandNum = Number(brandVal);
        if (!isNaN(brandNum)) {
          conditions.push(eq(products.brandId, brandNum));
        } else {
          const br = await db.select().from(brands).where(eq(brands.slug, brandVal)).limit(1);
          if (br.length > 0) {
            conditions.push(eq(products.brandId, br[0].id));
          }
        }
      }

      if (manufacturer) {
        const mfgQuery = `%${String(manufacturer).trim()}%`;
        conditions.push(or(
          ilike(products.manufacturer, mfgQuery),
          ilike(brands.manufacturer, mfgQuery)
        ));
      }

      if (application) {
        const appQuery = `%${String(application).trim()}%`;
        conditions.push(ilike(products.application, appQuery));
      }

      if (verificationStatus && verificationStatus !== "ALL") {
        conditions.push(eq(products.verificationStatus, String(verificationStatus)));
      }

      // Order By
      let orderByClause = desc(products.id);
      if (sort === "name-asc") {
        orderByClause = asc(products.name);
      } else if (sort === "name-desc") {
        orderByClause = desc(products.name);
      } else if (sort === "brand-asc") {
        orderByClause = asc(brands.name);
      } else if (sort === "featured") {
        orderByClause = desc(products.featured);
      } else if (sort === "manufacturer-asc") {
        orderByClause = asc(sql`COALESCE(${products.manufacturer}, ${brands.manufacturer})`);
      }

      const totalResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(conditions.length ? and(...conditions) : undefined);

      const total = totalResult[0]?.count || 0;

      const productList = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          model: products.model,
          catalogNumber: products.catalogNumber,
          manufacturer: products.manufacturer,
          brandId: products.brandId,
          brandName: brands.name,
          brandLogo: brands.logo,
          brandManufacturer: brands.manufacturer,
          categoryId: products.categoryId,
          categoryName: categories.name,
          subcategoryId: products.subcategoryId,
          description: products.description,
          technicalSpecs: products.technicalSpecs,
          application: products.application,
          presentation: products.presentation,
          verificationStatus: products.verificationStatus,
          status: products.status,
          confidenceLevel: products.confidenceLevel,
          featured: products.featured,
          createdAt: products.createdAt,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(orderByClause)
        .limit(limitNum)
        .offset(offset);
        
      const productIds = productList.map((p) => p.id);
      let imagesMap: Record<number, Array<{ id: number; url: string; altText?: string | null }>> = {};

      if (productIds.length > 0) {
        const images = await db
          .select({
            id: productImages.id,
            productId: productImages.productId,
            url: productImages.url,
            altText: productImages.altText,
          })
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
          .orderBy(productImages.sortOrder);

        images.forEach((img) => {
          if (!imagesMap[img.productId]) {
            imagesMap[img.productId] = [];
          }
          imagesMap[img.productId].push({
            id: img.id,
            url: img.url,
            altText: img.altText,
          });
        });
      }

      const fullProducts = productList.map((p) => ({
        ...p,
        images: imagesMap[p.id] || [],
        imageUrl: imagesMap[p.id]?.[0]?.url || null,
      }));

      res.setHeader("X-Total-Count", String(total));
      res.setHeader("X-Page", String(pageNum));
      res.setHeader("X-Limit", String(limitNum));

      const responsePayload = (format === "paginated" || page !== undefined || req.query.paginate === "true")
        ? {
            items: fullProducts,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          }
        : fullProducts;

      const etag = cacheEngine.set(cacheKey, responsePayload, 90, ["products", "catalog"]);
      res.setHeader("ETag", etag);
      res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
      res.setHeader("X-Cache-Status", "MISS");

      return res.json(responsePayload);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  // Product by Slug
  static async getProductBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const cacheKey = `product:slug:${slug}`;
      const cached = cacheEngine.get<any>(cacheKey);
      if (cached) {
        res.setHeader("ETag", cached.etag);
        res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
        res.setHeader("X-Cache-Status", "HIT");
        if (req.headers["if-none-match"] === cached.etag) {
          return res.status(304).end();
        }
        return res.json(cached.value);
      }
      const isNumeric = /^\d+$/.test(slug);
      const condition = isNumeric
        ? or(eq(products.slug, slug), eq(products.id, parseInt(slug, 10)))
        : eq(products.slug, slug);

      const product = await db.select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        model: products.model,
        catalogNumber: products.catalogNumber,
        manufacturer: products.manufacturer,
        description: products.description,
        technicalSpecs: products.technicalSpecs,
        application: products.application,
        presentation: products.presentation,
        brandId: products.brandId,
        categoryId: products.categoryId,
        subcategoryId: products.subcategoryId,
        brandName: brands.name,
        brandLogo: brands.logo,
        brandSlug: brands.slug,
        brandManufacturer: brands.manufacturer,
        categoryName: categories.name,
        categorySlug: categories.slug,
        verificationStatus: products.verificationStatus,
        status: products.status,
        confidenceLevel: products.confidenceLevel,
        featured: products.featured,
        sourceUrl: products.sourceUrl,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(condition)
      .limit(1);

      if (product.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productId = product[0].id;
      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, productId))
        .orderBy(productImages.sortOrder);

      const documents = await db
        .select()
        .from(productDocuments)
        .where(eq(productDocuments.productId, productId));

      let subcategory: { id: number; name: string; slug: string } | null = null;
      if (product[0].subcategoryId) {
        const subcatList = await db
          .select({ id: categories.id, name: categories.name, slug: categories.slug })
          .from(categories)
          .where(eq(categories.id, product[0].subcategoryId))
          .limit(1);
        if (subcatList.length > 0) {
          subcategory = subcatList[0];
        }
      }

      let siblingModels: any[] = [];
      if (product[0].brandId) {
        siblingModels = await db
          .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            model: products.model,
            catalogNumber: products.catalogNumber,
          })
          .from(products)
          .where(and(eq(products.brandId, product[0].brandId), sql`${products.id} != ${productId}`))
          .limit(6);
      }

      const prevList = await db
        .select({ id: products.id, name: products.name, slug: products.slug, model: products.model })
        .from(products)
        .where(
          product[0].categoryId 
            ? and(eq(products.categoryId, product[0].categoryId), sql`${products.id} < ${productId}`) 
            : sql`${products.id} < ${productId}`
        )
        .orderBy(desc(products.id))
        .limit(1);

      const nextList = await db
        .select({ id: products.id, name: products.name, slug: products.slug, model: products.model })
        .from(products)
        .where(
          product[0].categoryId 
            ? and(eq(products.categoryId, product[0].categoryId), sql`${products.id} > ${productId}`) 
            : sql`${products.id} > ${productId}`
        )
        .orderBy(asc(products.id))
        .limit(1);

      let relatedProducts: any[] = [];
      const relatedConditions: any[] = [sql`${products.id} != ${productId}`];
      if (product[0].categoryId) {
        relatedConditions.push(eq(products.categoryId, product[0].categoryId));
      }

      const relatedList = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          model: products.model,
          catalogNumber: products.catalogNumber,
          manufacturer: products.manufacturer,
          brandName: brands.name,
          categoryName: categories.name,
          verificationStatus: products.verificationStatus,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(...relatedConditions))
        .limit(4);

      if (relatedList.length > 0) {
        const rIds = relatedList.map(r => r.id);
        const rImages = await db
          .select({
            productId: productImages.productId,
            url: productImages.url,
          })
          .from(productImages)
          .where(inArray(productImages.productId, rIds));

        const rImgMap: Record<number, string> = {};
        rImages.forEach(img => {
          if (!rImgMap[img.productId]) rImgMap[img.productId] = img.url;
        });

        relatedProducts = relatedList.map(r => ({
          ...r,
          imageUrl: rImgMap[r.id] || null,
        }));
      }

      const fullProductData = {
        ...product[0],
        imageUrl: images[0]?.url || null,
        subcategory,
        images,
        documents,
        siblingModels,
        prevProduct: prevList[0] || null,
        nextProduct: nextList[0] || null,
        relatedProducts,
      };

      const etag = cacheEngine.set(cacheKey, fullProductData, 180, ["products", `product:${slug}`, `product:${productId}`]);
      res.setHeader("ETag", etag);
      res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
      res.setHeader("X-Cache-Status", "MISS");

      res.json(fullProductData);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }
}
