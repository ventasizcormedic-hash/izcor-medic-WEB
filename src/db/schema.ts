import { pgTable, serial, text, varchar, integer, boolean, timestamp, json, primaryKey } from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  logo: text("logo"),
  website: text("website"),
  description: text("description"),
  sourceUrl: text("source_url"),
  status: varchar("status", { length: 50 }).default("ACTIVE"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id"),
  image: text("image"),
  status: varchar("status", { length: 50 }).default("ACTIVE"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").references(() => brands.id),
  manufacturer: varchar("manufacturer", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }),
  catalogNumber: varchar("catalog_number", { length: 255 }),
  categoryId: integer("category_id").references(() => categories.id),
  subcategoryId: integer("subcategory_id").references(() => categories.id),
  description: text("description"),
  technicalSpecs: text("technical_specs"),
  application: text("application"),
  presentation: text("presentation"),
  status: varchar("status", { length: 50 }).default("ACTIVE"),
  verificationStatus: varchar("verification_status", { length: 50 }).default("DRAFT"),
  publicationStatus: varchar("publication_status", { length: 50 }).default("UNPUBLISHED"),
  confidenceLevel: varchar("confidence_level", { length: 50 }).default("LOW"),
  featured: boolean("featured").default(false),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  validationIssues: json("validation_issues"),
  validationScore: integer("validation_score").default(0),
  verifiedBy: varchar("verified_by", { length: 255 }),
  verifiedAt: timestamp("verified_at"),
  rejectionReason: text("rejection_reason"),
  lastValidatedAt: timestamp("last_validated_at"),
  importJobId: integer("import_job_id"),
  auditReport: json("audit_report"),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  url: text("url").notNull(),
  sourceUrl: text("source_url"),
  altText: varchar("alt_text", { length: 255 }),
  filename: varchar("filename", { length: 255 }),
  licenseStatus: varchar("license_status", { length: 100 }),
  sortOrder: integer("sort_order").default(0),
});

export const productDocuments = pgTable("product_documents", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }),
  sourceUrl: text("source_url"),
  title: varchar("title", { length: 255 }),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  institution: varchar("institution", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  city: varchar("city", { length: 100 }),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("NEW"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quoteItems = pgTable("quote_items", {
  quoteId: integer("quote_id").notNull().references(() => quotes.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").default(1).notNull(),
  notes: text("notes"),
}, (table) => [
  primaryKey({ columns: [table.quoteId, table.productId] })
]);

export const tdrRequests = pgTable("tdr_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  description: text("description"),
  fileUrl: text("file_url"),
  status: varchar("status", { length: 50 }).default("NEW"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  role: varchar("role", { length: 50 }).default("USER"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pharmacovigilanceReports = pgTable("pharmacovigilance_reports", {
  id: serial("id").primaryKey(),
  reportCode: varchar("report_code", { length: 100 }),
  patientName: varchar("patient_name", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  reporterName: varchar("reporter_name", { length: 255 }),
  reporterEmail: varchar("reporter_email", { length: 255 }),
  reporterPhone: varchar("reporter_phone", { length: 50 }),
  patientId: varchar("patient_id", { length: 100 }),
  productName: varchar("product_name", { length: 255 }),
  lotNumber: varchar("lot_number", { length: 100 }),
  symptomDescription: text("symptom_description"),
  adverseEvent: text("adverse_event"),
  isProfessional: boolean("is_professional").default(false),
  severity: varchar("severity", { length: 50 }),
  status: varchar("status", { length: 50 }).default("NEW"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  brandId: integer("brand_id").references(() => brands.id),
  brandName: varchar("brand_name", { length: 255 }),
  domain: varchar("domain", { length: 255 }).notNull(),
  url: text("url").notNull(),
  productsUrl: text("products_url"),
  sitemapUrl: text("sitemap_url"),
  country: varchar("country", { length: 100 }),
  priority: integer("priority").default(2),
  status: varchar("status", { length: 50 }).default("ACTIVE"),
  lastExtractionAt: timestamp("last_extraction_at"),
  lastCheckedAt: timestamp("last_checked_at"),
  detectedProductCount: integer("detected_product_count").default(0),
  sourceType: varchar("source_type", { length: 100 }).default("OFFICIAL_MANUFACTURER"),
  verificationStatus: varchar("verification_status", { length: 100 }).default("UNVERIFIED"),
  verificationSource: text("verification_source"),
  verificationDate: timestamp("verification_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const draftProducts = pgTable("draft_products", {
  id: serial("id").primaryKey(),
  jobId: varchar("job_id", { length: 100 }),
  sourceId: integer("source_id").references(() => sources.id),
  sourceUrl: text("source_url"),
  productUrl: text("product_url"),
  name: varchar("name", { length: 500 }).notNull(),
  brand: varchar("brand", { length: 255 }),
  manufacturer: varchar("manufacturer", { length: 255 }),
  model: varchar("model", { length: 255 }),
  reference: varchar("reference", { length: 255 }),
  description: text("description"),
  specifications: json("specifications"),
  applications: text("applications"),
  presentation: varchar("presentation", { length: 255 }),
  variants: json("variants"),
  accessories: json("accessories"),
  configurations: json("configurations"),
  images: json("images"),
  documents: json("documents"),
  conflicts: json("conflicts"),
  missingFields: json("missing_fields"),
  sourcesList: json("sources_list"),
  completenessBreakdown: json("completeness_breakdown"),
  auditReport: json("audit_report"),
  completenessScore: integer("completeness_score").default(0),
  status: varchar("status", { length: 50 }).default("DRAFT"),
  duplicateStatus: varchar("duplicate_status", { length: 50 }).default("UNIQUE"),
  originalData: json("original_data"),
  normalizedData: json("normalized_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const autonomousSettings = pgTable("autonomous_settings", {
  id: serial("id").primaryKey(),
  autonomousModeEnabled: boolean("autonomous_mode_enabled").default(true),
  operatingMode: varchar("operating_mode", { length: 50 }).default("AUTO"),
  autoPublishEnabled: boolean("auto_publish_enabled").default(true),
  autoPublishMinScore: integer("auto_publish_min_score").default(85),
  riskThreshold: varchar("risk_threshold", { length: 50 }).default("LOW"),
  maxConcurrency: integer("max_concurrency").default(4),
  crawlIntervalHours: integer("crawl_interval_hours").default(12),
  adaptiveCrawl: boolean("adaptive_crawl").default(true),
  canaryPercentage: integer("canary_percentage").default(10),
  emergencyStop: boolean("emergency_stop").default(false),
  anomalyThresholdPercent: integer("anomaly_threshold_percent").default(40),
  currentRuleVersion: varchar("current_rule_version", { length: 50 }).default("v1.0.0"),
  lastExecutionAt: timestamp("last_execution_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by", { length: 255 }),
});

export const backgroundJobs = pgTable("background_jobs", {
  id: serial("id").primaryKey(),
  jobType: varchar("job_type", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(),
  progress: integer("progress").default(0),
  totalItems: integer("total_items").default(0),
  processedItems: integer("processed_items").default(0),
  errorCount: integer("error_count").default(0),
  payload: json("payload"),
  resultSummary: json("result_summary"),
  errorLog: json("error_log"),
  createdAt: timestamp("created_at").defaultNow(),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
});

export const duplicateCases = pgTable("duplicate_cases", {
  id: serial("id").primaryKey(),
  productAId: integer("product_a_id").notNull(),
  productBId: integer("product_b_id").notNull(),
  productAType: varchar("product_a_type", { length: 50 }).default("CATALOG"),
  productBType: varchar("product_b_type", { length: 50 }).default("CATALOG"),
  duplicateScore: integer("duplicate_score").default(0),
  classification: varchar("classification", { length: 50 }).default("MEDIUM_PROBABILITY"),
  matchingSignals: json("matching_signals"),
  conflictingSignals: json("conflicting_signals"),
  status: varchar("status", { length: 50 }).default("PENDING_REVIEW"),
  recommendation: text("recommendation"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const importRecords = pgTable("import_records", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => backgroundJobs.id),
  rawData: json("raw_data").notNull(),
  mappedData: json("mapped_data"),
  status: varchar("status", { length: 50 }).default("PENDING"),
  errorMessage: text("error_message"),
  productId: integer("product_id"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const productMergeHistory = pgTable("product_merge_history", {
  id: serial("id").primaryKey(),
  primaryProductId: integer("primary_product_id").notNull(),
  secondaryProductId: integer("secondary_product_id").notNull(),
  mergedDataSnapshot: json("merged_data_snapshot"),
  reason: text("reason"),
  userId: text("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productVersions = pgTable("product_versions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  versionNumber: integer("version_number").notNull(),
  jobId: varchar("job_id", { length: 100 }),
  ruleVersion: varchar("rule_version", { length: 50 }),
  changeType: varchar("change_type", { length: 50 }).notNull(),
  snapshot: json("snapshot").notNull(),
  changesDiff: json("changes_diff"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 }).default("AUTONOMOUS_ENGINE"),
});

export const scraperUrls = pgTable("scraper_urls", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => sources.id),
  url: text("url").notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  brandName: varchar("brand_name", { length: 255 }),
  country: varchar("country", { length: 100 }),
  sourceType: varchar("source_type", { length: 100 }).default("PRODUCT_LIST"),
  priority: integer("priority").default(2),
  status: varchar("status", { length: 50 }).default("ACTIVE"),
  lastExtractionAt: timestamp("last_extraction_at"),
  detectedProducts: integer("detected_products").default(0),
  errorsCount: integer("errors_count").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scrapingJobs = pgTable("scraping_jobs", {
  id: serial("id").primaryKey(),
  jobId: varchar("job_id", { length: 100 }).notNull().unique(),
  sourceId: integer("source_id").references(() => sources.id),
  urlId: integer("url_id").references(() => scraperUrls.id),
  status: varchar("status", { length: 50 }).default("PENDING"),
  progressPercent: integer("progress_percent").default(0),
  totalFound: integer("total_found").default(0),
  processedCount: integer("processed_count").default(0),
  validCount: integer("valid_count").default(0),
  duplicatesCount: integer("duplicates_count").default(0),
  errorsCount: integer("errors_count").default(0),
  incompleteCount: integer("incomplete_count").default(0),
  imagesFound: integer("images_found").default(0),
  documentsFound: integer("documents_found").default(0),
  executionTimeMs: integer("execution_time_ms").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  errorLog: text("error_log"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sourceCandidates = pgTable("source_candidates", {
  id: serial("id").primaryKey(),
  domain: varchar("domain", { length: 255 }).notNull(),
  url: text("url").notNull(),
  discoveredVia: text("discovered_via"),
  trustLevel: varchar("trust_level", { length: 50 }).default("NEW"),
  status: varchar("status", { length: 50 }).default("PENDING_VALIDATION"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const autonomousAuditLogs = pgTable("autonomous_audit_logs", {
  id: serial("id").primaryKey(),
  jobId: varchar("job_id", { length: 100 }),
  productId: integer("product_id"),
  sourceId: integer("source_id"),
  action: varchar("action", { length: 100 }).notNull(),
  decision: varchar("decision", { length: 100 }).notNull(),
  riskScore: varchar("risk_score", { length: 50 }).default("LOW"),
  ruleVersion: varchar("rule_version", { length: 50 }).default("v1.0.0"),
  evidenceSummary: text("evidence_summary"),
  executedRules: json("executed_rules"),
  previousSnapshot: json("previous_snapshot"),
  newSnapshot: json("new_snapshot"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Alias definitions for controller backward compatibility
export const manufacturers = pgTable("manufacturers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});
export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
});
export const scrapedSources = pgTable("scraped_sources", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
});
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: text("action"),
});
export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  metric: text("metric"),
});
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key"),
  value: text("value"),
});
export const catalogQualityMetrics = pgTable("catalog_quality_metrics", {
  id: serial("id").primaryKey(),
  score: integer("score"),
});
export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  review: text("review"),
});
export const auditLog = auditLogs;
export const systemMetricsHistory = systemMetrics;
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key"),
});
export const errorLogs = pgTable("error_logs", {
  id: serial("id").primaryKey(),
  message: text("message"),
});
export const categoriesCatalog = categories;
export const brandsCatalog = brands;
