import { Router } from "express";
import { CatalogController } from "../controllers/catalog.controller.ts";

const router = Router();

// Categories
router.get("/categories", CatalogController.getCategories);
router.get("/categories/:slug/details", CatalogController.getCategoryDetails);
router.get("/categories/:slug/products", CatalogController.getCategoryProducts);

// Facets
router.get("/catalog/facets", CatalogController.getFacets);

// Search suggestions & autocomplete
router.get("/search/suggestions", CatalogController.getSearchSuggestions);
router.get("/search/autocomplete", CatalogController.getAutocomplete);

// Manufacturers
router.get("/manufacturers", CatalogController.getManufacturers);
router.get("/manufacturers/:nameOrSlug", CatalogController.getManufacturerDetail);

// Brands
router.get("/brands", CatalogController.getBrands);
router.get("/brands/:idOrSlug", CatalogController.getBrandDetail);

// Products
router.get("/products", CatalogController.getProducts);
router.get("/products/:slug", CatalogController.getProductBySlug);

export default router;
