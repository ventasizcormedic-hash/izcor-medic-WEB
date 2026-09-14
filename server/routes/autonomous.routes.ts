import { Router } from "express";
import { AutonomousController } from "../controllers/autonomous.controller.ts";
import { requireAuth } from "../../src/middleware/auth.ts";

const router = Router();

router.use(requireAuth);

// Background Jobs
router.get("/jobs", AutonomousController.getJobs);
router.post("/jobs", AutonomousController.createJob);
router.get("/jobs/:id", AutonomousController.getJobById);

// System Health
router.get("/system-health", AutonomousController.getSystemHealth);

// Mass Import
router.post("/imports", AutonomousController.createImportJob);
router.post("/imports/:id/chunk", AutonomousController.addImportChunk);
router.post("/imports/:id/start", AutonomousController.startImportJob);
router.post("/imports/:id/pause", AutonomousController.pauseImportJob);
router.post("/imports/:id/cancel", AutonomousController.cancelImportJob);
router.get("/imports/:id/records", AutonomousController.getImportRecords);

// Autonomous Catalog Engine
router.get("/autonomous/dashboard", AutonomousController.getAutonomousDashboard);
router.get("/autonomous/settings", AutonomousController.getAutonomousSettings);
router.put("/autonomous/settings", AutonomousController.updateAutonomousSettings);
router.post("/autonomous/run", AutonomousController.runAutonomousCycle);
router.post("/autonomous/emergency-stop", AutonomousController.emergencyStop);
router.post("/autonomous/resume", AutonomousController.resumeEngine);
router.post("/autonomous/reconciliation", AutonomousController.runReconciliation);
router.post("/autonomous/rollback", AutonomousController.rollbackJob);
router.post("/autonomous/approve-draft/:id", AutonomousController.approveAutonomousDraft);
router.post("/autonomous/reject-draft/:id", AutonomousController.rejectAutonomousDraft);
router.post("/autonomous/source-candidates/:id/approve", AutonomousController.approveSourceCandidate);

// Performance APM
router.get("/performance/summary", AutonomousController.getPerformanceSummary);
router.get("/performance/checklist", AutonomousController.getPerformanceChecklist);
router.get("/performance/benchmark", AutonomousController.getPerformanceBenchmark);
router.post("/performance/cache/clear", AutonomousController.clearCache);
router.post("/performance/regressions/clear", AutonomousController.clearPerformanceRegressions);
router.post("/performance/simulate-load", AutonomousController.simulatePerformanceLoad);

// 50K Readiness
router.get("/readiness/report", AutonomousController.getReadinessReport);
router.post("/readiness/run-check", AutonomousController.runReadinessCheck);
router.post("/readiness/dry-run", AutonomousController.dryRunSimulation);
router.post("/readiness/safe-start", AutonomousController.activateSafeStart);

export default router;
