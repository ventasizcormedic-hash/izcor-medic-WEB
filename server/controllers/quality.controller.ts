import { Response } from "express";
import { AuthRequest } from "../../src/middleware/auth.ts";
import { db } from "../../src/db/index.ts";
import {
  products,
  duplicateCases,
  productImages,
  productDocuments,
} from "../../src/db/schema.ts";
import { eq, or, desc } from "drizzle-orm";
import { deduplicationService } from "../../src/services/deduplicationService.ts";
import { validationService } from "../../src/services/validationService.ts";
import { catalogQualityService } from "../../src/services/catalogQualityService.ts";
import { productReviewService } from "../../src/services/productReviewService.ts";

export class QualityController {
  // Deduplication & Identity Management
  static async getDuplicates(req: AuthRequest, res: Response) {
    try {
      const cases = await db.select().from(duplicateCases).orderBy(desc(duplicateCases.duplicateScore));
      
      const enrichedCases = [];
      for (const c of cases) {
        const [prodA] = await db.select().from(products).where(eq(products.id, c.productAId));
        const [prodB] = await db.select().from(products).where(eq(products.id, c.productBId));
        
        enrichedCases.push({
          ...c,
          productA: prodA || { id: c.productAId, name: "Producto #" + c.productAId },
          productB: prodB || { id: c.productBId, name: "Producto #" + c.productBId },
        });
      }

      res.json(enrichedCases);
    } catch (e) {
      console.error("Error fetching duplicate cases:", e);
      res.status(500).json({ error: "Failed to fetch duplicate cases" });
    }
  }

  static async scanDuplicates(req: AuthRequest, res: Response) {
    try {
      const result = await deduplicationService.runCatalogAudit();
      res.json({ success: true, ...result });
    } catch (e) {
      console.error("Error running deduplication scan:", e);
      res.status(500).json({ error: "Failed to run deduplication audit" });
    }
  }

  static async mergeDuplicates(req: AuthRequest, res: Response) {
    try {
      const { primaryId, secondaryId, reason } = req.body;
      if (!primaryId || !secondaryId) {
        return res.status(400).json({ error: "primaryId y secondaryId son requeridos" });
      }

      await deduplicationService.secureMerge(Number(primaryId), Number(secondaryId), req.user?.uid || "admin", reason || "Fusión segura manual");
      res.json({ success: true, message: "Productos fusionados de forma segura con trazabilidad preservada." });
    } catch (e: any) {
      console.error("Error merging products:", e);
      res.status(400).json({ error: e.message || "Failed to merge products securely" });
    }
  }

  static async updateDuplicateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      await db.update(duplicateCases).set({
        status: status || "PENDING_REVIEW",
        notes: notes || null,
        updatedAt: new Date()
      }).where(eq(duplicateCases.id, Number(id)));

      res.json({ success: true, message: "Estado de duplicado actualizado." });
    } catch (e) {
      console.error("Error updating duplicate case status:", e);
      res.status(500).json({ error: "Failed to update duplicate case status" });
    }
  }

  // Validation
  static async getValidationProducts(req: AuthRequest, res: Response) {
    try {
      const allProds = await db.select().from(products).orderBy(desc(products.createdAt));
      res.json(allProds);
    } catch (e) {
      console.error("Error fetching validation products:", e);
      res.status(500).json({ error: "Failed to fetch validation products" });
    }
  }

  static async runValidationForProduct(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await validationService.validateProduct(id);
      res.json({ success: true, ...result });
    } catch (e: any) {
      console.error("Error running validation:", e);
      res.status(500).json({ error: e.message || "Failed to validate product" });
    }
  }

  static async runMassValidation(req: AuthRequest, res: Response) {
    try {
      const allProds = await db.select().from(products);
      let validatedCount = 0;
      for (const p of allProds) {
        await validationService.validateProduct(p.id);
        validatedCount++;
      }
      res.json({ success: true, message: `Validación masiva completada. Analizados: ${validatedCount} productos.` });
    } catch (e) {
      console.error("Error running mass validation:", e);
      res.status(500).json({ error: "Failed to run mass validation" });
    }
  }

  static async verifyProductValidation(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const userEmail = req.user?.email || "admin@izcormedic.com";
      await validationService.verifyProduct(id, userEmail);
      res.json({ success: true, message: "Producto verificado con éxito y firmado digitalmente en el registro." });
    } catch (e: any) {
      console.error("Error verifying product:", e);
      res.status(500).json({ error: e.message || "Failed to verify product" });
    }
  }

  static async rejectProductValidation(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const { reason } = req.body;
      const userEmail = req.user?.email || "admin@izcormedic.com";
      await validationService.rejectProduct(id, reason || "Rechazado por control de calidad", userEmail);
      res.json({ success: true, message: "Producto rechazado y documentado en el historial." });
    } catch (e: any) {
      console.error("Error rejecting product:", e);
      res.status(500).json({ error: e.message || "Failed to reject product" });
    }
  }

  // Quality Control Audit & Incidents
  static async getQualityAudit(req: AuthRequest, res: Response) {
    try {
      const { type, severity, status, search } = req.query;
      const auditResult = await catalogQualityService.runFullCatalogQualityAudit();

      let filteredReports = auditResult.reports;

      if (type && type !== "ALL") {
        filteredReports = filteredReports.filter(r => 
          r.incidents.some(inc => inc.type === type)
        );
      }

      if (severity && severity !== "ALL") {
        filteredReports = filteredReports.filter(r => 
          r.incidents.some(inc => inc.severity === severity)
        );
      }

      if (status && status !== "ALL") {
        filteredReports = filteredReports.filter(r => r.verificationStatus === status);
      }

      if (search && typeof search === "string" && search.trim().length > 0) {
        const q = search.trim().toLowerCase();
        filteredReports = filteredReports.filter(r => 
          r.productName.toLowerCase().includes(q) ||
          (r.model && r.model.toLowerCase().includes(q)) ||
          (r.catalogNumber && r.catalogNumber.toLowerCase().includes(q)) ||
          (r.manufacturer && r.manufacturer.toLowerCase().includes(q)) ||
          (r.brandName && r.brandName.toLowerCase().includes(q)) ||
          String(r.productId) === q
        );
      }

      res.json({
        success: true,
        summary: auditResult.summary,
        reports: filteredReports,
        totalFiltered: filteredReports.length,
      });
    } catch (e: any) {
      console.error("Error running quality audit:", e);
      res.status(500).json({ error: e.message || "Failed to run quality audit" });
    }
  }

  static async runQualityScan(req: AuthRequest, res: Response) {
    try {
      const auditResult = await catalogQualityService.runFullCatalogQualityAudit();

      for (const report of auditResult.reports) {
        const issues = report.incidents.map(inc => ({
          field: inc.type,
          severity: inc.severity,
          message: inc.message,
        }));

        let newStatus = report.verificationStatus;
        if (report.hasCritical && newStatus === "VERIFIED") {
          newStatus = "REVIEW";
        }

        await db.update(products).set({
          validationIssues: issues,
          validationScore: Math.max(0, 100 - (issues.length * 15)),
          verificationStatus: newStatus,
          lastValidatedAt: new Date(),
          updatedAt: new Date(),
        }).where(eq(products.id, report.productId));
      }

      res.json({
        success: true,
        message: `Escaneo completo de calidad finalizado. Se auditaron ${auditResult.reports.length} productos.`,
        summary: auditResult.summary,
      });
    } catch (e: any) {
      console.error("Error executing quality scan:", e);
      res.status(500).json({ error: e.message || "Failed to execute quality scan" });
    }
  }

  static async quickFixProduct(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const userEmail = req.user?.email || "admin@izcormedic.com";
      await catalogQualityService.quickFixProduct(id, req.body, userEmail);

      await validationService.validateProduct(id);

      res.json({
        success: true,
        message: "Producto actualizado y re-evaluado en el control de calidad.",
      });
    } catch (e: any) {
      console.error("Error in quick-fix:", e);
      res.status(500).json({ error: e.message || "Failed to quick fix product" });
    }
  }

  // Product Review Center
  static async getReviewProducts(req: AuthRequest, res: Response) {
    try {
      const items = await db.select().from(products).orderBy(desc(products.createdAt));
      res.json(items);
    } catch (e) {
      console.error("Error fetching review products:", e);
      res.status(500).json({ error: "Failed to fetch review products" });
    }
  }

  static async getReviewProductDetail(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const [prod] = await db.select().from(products).where(eq(products.id, id));
      if (!prod) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      const images = await db.select().from(productImages).where(eq(productImages.productId, id));
      const documents = await db.select().from(productDocuments).where(eq(productDocuments.productId, id));
      const duplicates = await db.select().from(duplicateCases).where(
        or(eq(duplicateCases.productAId, id), eq(duplicateCases.productBId, id))
      );

      res.json({
        ...prod,
        images,
        documents,
        duplicates
      });
    } catch (e) {
      console.error("Error fetching review product detail:", e);
      res.status(500).json({ error: "Failed to fetch review product detail" });
    }
  }

  static async updateReviewProduct(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const userEmail = req.user?.email || "admin@izcormedic.com";
      const { reason, ...updates } = req.body;
      
      const updated = await productReviewService.updateProduct(id, updates, userEmail, reason);
      res.json({ success: true, message: "Cambios guardados con éxito. Historial actualizado.", product: updated });
    } catch (e: any) {
      console.error("Error updating review product:", e);
      res.status(500).json({ error: e.message || "Failed to update product" });
    }
  }

  static async updateReviewProductStatus(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const userEmail = req.user?.email || "admin@izcormedic.com";
      const { status, notes } = req.body;

      const updated = await productReviewService.setStatus(id, status, userEmail, notes);
      res.json({ success: true, message: `Estado actualizado a ${status}.`, product: updated });
    } catch (e: any) {
      console.error("Error updating product status:", e);
      res.status(500).json({ error: e.message || "Failed to update product status" });
    }
  }
}
