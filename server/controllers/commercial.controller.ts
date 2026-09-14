import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { db } from "../../src/db/index.ts";
import { quotes, quoteItems, tdrRequests, pharmacovigilanceReports, products, brands } from "../../src/db/schema.ts";
import { eq, desc } from "drizzle-orm";
import { AuthRequest } from "../../src/middleware/auth.ts";

const projectRoot = (() => {
  try {
    return path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
  } catch {
    return process.cwd();
  }
})();

export class CommercialController {
  // Submit Formal Quote Request
  static async submitQuote(req: Request, res: Response) {
    try {
      const {
        fullName,
        name,
        organization,
        ruc,
        institutionType,
        region,
        email,
        phone,
        notes,
        items,
      } = req.body;

      const contactName = (fullName || name || "").toString().trim();

      if (!contactName || !email || !phone) {
        return res.status(400).json({ error: "Nombre, correo institucional y teléfono son campos obligatorios." });
      }

      const quoteResult = await db.insert(quotes).values({
        name: contactName,
        company: organization ? String(organization).trim() : null,
        institution: institutionType ? String(institutionType).trim() : null,
        email: String(email).trim(),
        phone: String(phone).trim(),
        city: region ? String(region).trim() : null,
        message: notes ? String(notes).trim() : (ruc ? `RUC: ${ruc}` : null),
        status: "NEW",
      }).returning();

      const createdQuote = quoteResult[0];

      if (Array.isArray(items) && items.length > 0) {
        for (const itm of items) {
          const pId = Number(itm.productId || itm.id);
          if (!isNaN(pId)) {
            await db.insert(quoteItems).values({
              quoteId: createdQuote.id,
              productId: pId,
              quantity: Math.max(1, Number(itm.quantity) || 1),
              notes: itm.notes ? String(itm.notes).trim() : null,
            }).onConflictDoNothing().catch(() => {});
          }
        }
      }

      res.status(201).json({
        success: true,
        quoteId: `COT-${String(createdQuote.id).padStart(5, "0")}`,
        id: createdQuote.id,
        expedienteCode: `COT-${String(createdQuote.id).padStart(5, "0")}`,
        message: "Solicitud de cotización formal registrada exitosamente. Un ingeniero biomédico emitirá la propuesta en menos de 24 horas."
      });
    } catch (e: any) {
      console.error("Error creating quote:", e);
      res.status(500).json({ error: e.message || "Error al registrar la cotización." });
    }
  }

  // Admin: Get All Quotes with Product Details
  static async getAdminQuotes(req: AuthRequest, res: Response) {
    try {
      const allQuotes = await db.select().from(quotes).orderBy(desc(quotes.createdAt));
      
      const quotesWithItems = await Promise.all(allQuotes.map(async (q: any) => {
        const items = await db
          .select({
            productId: quoteItems.productId,
            quantity: quoteItems.quantity,
            notes: quoteItems.notes,
            productName: products.name,
            productModel: products.model,
            productSlug: products.slug,
            brandName: brands.name,
          })
          .from(quoteItems)
          .leftJoin(products, eq(quoteItems.productId, products.id))
          .leftJoin(brands, eq(products.brandId, brands.id))
          .where(eq(quoteItems.quoteId, q.id));

        return {
          ...q,
          items,
        };
      }));

      res.json(quotesWithItems);
    } catch (e: any) {
      console.error("Error fetching admin quotes:", e);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  }

  // Admin: Update Quote Status
  static async updateQuoteStatus(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      if (isNaN(id) || !status) {
        return res.status(400).json({ error: "ID y estado requeridos" });
      }

      await db.update(quotes).set({ status }).where(eq(quotes.id, id));
      res.json({ success: true, message: `Estado de cotización actualizado a ${status}` });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Error updating quote status" });
    }
  }

  // Submit TDR Requirement File
  static async submitTdr(req: Request, res: Response) {
    try {
      const {
        name,
        institution,
        email,
        phone,
        description,
        fileName,
        fileData,
        fileBase64,
      } = req.body;

      if (!name || !institution || !email || !phone) {
        return res.status(400).json({ error: "Nombre, institución, email y teléfono son campos obligatorios." });
      }

      const rawBase64 = fileBase64 || fileData || null;
      let storedFileUrl: string | null = null;
      if (rawBase64 && fileName) {
        const tdrUploadDir = path.resolve(projectRoot, "public", "uploads", "tdr");
        if (!fs.existsSync(tdrUploadDir)) {
          fs.mkdirSync(tdrUploadDir, { recursive: true });
        }
        const safeName = `${Date.now()}_${path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const filePath = path.join(tdrUploadDir, safeName);
        
        const base64Content = rawBase64.includes("base64,") ? rawBase64.split("base64,")[1] : rawBase64;
        fs.writeFileSync(filePath, Buffer.from(base64Content, "base64"));
        storedFileUrl = `/uploads/tdr/${safeName}`;
      }

      const tdrResult = await db.insert(tdrRequests).values({
        name: String(name).trim(),
        institution: String(institution).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        description: description ? String(description).trim() : null,
        fileUrl: storedFileUrl,
        status: "NEW",
      }).returning();

      const createdTdr = tdrResult[0];
      const tdrCode = `TDR-${String(createdTdr.id).padStart(5, "0")}`;

      res.status(201).json({
        success: true,
        tdrId: tdrCode,
        id: createdTdr.id,
        expedienteCode: tdrCode,
        fileUrl: storedFileUrl,
        message: "Expediente TDR recibido exitosamente. Nuestro equipo biomédico revisará las especificaciones en menos de 24 horas."
      });
    } catch (e: any) {
      console.error("Error creating TDR request:", e);
      res.status(500).json({ error: e.message || "Error al procesar expediente TDR." });
    }
  }

  // Admin: Get All TDR Requests
  static async getAdminTdr(req: AuthRequest, res: Response) {
    try {
      const allTdr = await db.select().from(tdrRequests).orderBy(desc(tdrRequests.createdAt));
      res.json(allTdr);
    } catch (e: any) {
      console.error("Error fetching admin TDR:", e);
      res.status(500).json({ error: "Failed to fetch TDR requests" });
    }
  }

  // Admin: Update TDR Request Status
  static async updateTdrStatus(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      if (isNaN(id) || !status) {
        return res.status(400).json({ error: "ID y estado requeridos" });
      }

      await db.update(tdrRequests).set({ status }).where(eq(tdrRequests.id, id));
      res.json({ success: true, message: `Estado de TDR actualizado a ${status}` });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Error updating TDR status" });
    }
  }

  // Contact Form Submission
  static async submitContact(req: Request, res: Response) {
    try {
      const { name, institution, email, phone, subject, message } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Nombre y correo son obligatorios." });
      }

      await db.insert(quotes).values({
        name: String(name).trim(),
        company: institution ? String(institution).trim() : null,
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        message: `[CONTACTO - ${subject || "Consulta General"}]: ${message || ""}`,
        status: "NEW",
      }).catch(err => console.warn("Contact quote log note:", err.message));

      res.json({
        success: true,
        message: "Tu mensaje ha sido recibido con éxito. Nos pondremos en contacto a la brevedad."
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Error al procesar mensaje de contacto." });
    }
  }

  // Submit Pharmacovigilance & Technovigilance Adverse Event Report
  static async submitPharmacovigilance(req: Request, res: Response) {
    try {
      const {
        patientName,
        contactEmail,
        contactPhone,
        productName,
        lotNumber,
        symptomDescription,
        isProfessional,
      } = req.body;

      if (!contactEmail || !productName || !symptomDescription) {
        return res.status(400).json({
          error: "Correo institucional/contacto, producto reportado y descripción del incidente son obligatorios.",
        });
      }

      const reportCode = `FV-${Date.now().toString().slice(-6)}`;

      const [report] = await db.insert(pharmacovigilanceReports).values({
        reportCode,
        patientName: patientName ? String(patientName).trim() : null,
        contactEmail: String(contactEmail).trim(),
        contactPhone: contactPhone ? String(contactPhone).trim() : null,
        productName: String(productName).trim(),
        lotNumber: lotNumber ? String(lotNumber).trim() : null,
        symptomDescription: String(symptomDescription).trim(),
        isProfessional: Boolean(isProfessional),
        status: "PENDING_REVIEW",
      }).returning();

      res.status(201).json({
        success: true,
        reportCode,
        id: report?.id,
        message: `Reporte de farmacovigilancia registrado exitosamente con código ${reportCode}. Nuestro departamento de calidad técnica iniciará la evaluación conforme a normativas DIGEMID.`,
      });
    } catch (e: any) {
      console.error("Error saving pharmacovigilance report:", e);
      res.status(500).json({ error: e.message || "Error al registrar reporte de farmacovigilancia." });
    }
  }

  // Admin: Get Pharmacovigilance Reports
  static async getAdminPharmacovigilance(req: AuthRequest, res: Response) {
    try {
      const reports = await db
        .select()
        .from(pharmacovigilanceReports)
        .orderBy(desc(pharmacovigilanceReports.createdAt));
      res.json(reports);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch pharmacovigilance reports" });
    }
  }

  // AI TDR Specification Analysis & Matching
  static async analyzeTdr(req: Request, res: Response) {
    try {
      const { text } = req.body;
      if (!text || String(text).trim().length < 10) {
        return res.status(400).json({ error: "Texto del requerimiento médico requerido." });
      }

      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
        try {
          const { GoogleGenAI } = await import("@google/genai");
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Eres un ingeniero biomédico experto en homologación de requerimientos técnicos hospitalarios (OSCE / MINSA / EsSalud). Analiza el siguiente requerimiento técnico y extrae en formato JSON:
            1. equipmentType: tipo principal de equipo
            2. clinicalSpecialty: especialidad clínica (ej. UCI, Centro Quirúrgico, Neonatología, etc.)
            3. criticalSpecs: lista de 3 a 6 especificaciones críticas obligatorias
            4. recommendedNorms: normativas peruanas aplicables (DIGEMID, ISO, IEC)
            5. suggestedMatchSummary: breve resumen técnico en español.

            Requerimiento:
            ${text}`,
          });

          return res.json({
            success: true,
            provider: "gemini",
            analysis: response.text,
          });
        } catch (aiErr: any) {
          console.warn("Gemini API note, using clinical heuristic engine:", aiErr.message);
        }
      }

      // Clinical heuristic matching
      const clinicalKeywords = [
        { word: "monitor", equipment: "Monitor de Signos Vitales Multiparámetro", specialty: "Cuidados Intensivos / UCI", norm: "IEC 60601-2-49 / DIGEMID" },
        { word: "cama", equipment: "Cama Clínica Eléctrica Hospitalaria UCI", specialty: "Hospitalización y Cuidados Críticos", norm: "IEC 60601-2-52 / NTP" },
        { word: "ecograf", equipment: "Ecógrafo Doppler Color Portátil", specialty: "Diagnóstico por Imágenes / Ginecología", norm: "DICOM 3.0 / CE 0123" },
        { word: "autoclave", equipment: "Autoclave de Mesa Clase B Automático", specialty: "Central de Esterilización Hospitalaria", norm: "EN 13060 / DIGEMID" },
        { word: "quirurgic", equipment: "Set de Instrumental Quirúrgico en Acero Alemán", specialty: "Centro Quirúrgico", norm: "DIN 1.4021 / Marcado CE" },
        { word: "hematolog", equipment: "Analizador Hematológico Automático", specialty: "Laboratorio Clínico", norm: "ISO 15189 / IVD" },
      ];

      const lower = text.toLowerCase();
      const matched = clinicalKeywords.find(k => lower.includes(k.word)) || {
        equipment: "Equipamiento Biomédico Homologado",
        specialty: "Tecnología Hospitalaria",
        norm: "Certificación DIGEMID y Marcado CE"
      };

      res.json({
        success: true,
        provider: "clinical-engine",
        analysis: {
          equipmentType: matched.equipment,
          clinicalSpecialty: matched.specialty,
          criticalSpecs: [
            "Compatibilidad con suministro eléctrico hospitalario de 220V / 60Hz",
            "Certificación de seguridad eléctrica y compatibilidad electromagnética",
            "Manual de operación y servicio en idioma español según bases OSCE",
            "Garantía de fábrica mínima de 24 meses y disponibilidad de repuestos"
          ],
          recommendedNorms: [matched.norm, "Buenas Prácticas de Manufactura (BPM)"],
          suggestedMatchSummary: `El requerimiento solicita ${matched.equipment} para ${matched.specialty}. IZCOR MEDIC cuenta con modelos homologados con entrega y certificación técnica inmediata.`
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Error analyzing TDR requirement" });
    }
  }
}
