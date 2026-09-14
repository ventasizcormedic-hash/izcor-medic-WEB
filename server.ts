import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { initDatabase } from "./src/db/index.ts";
import { initializeDatabaseIndexes } from "./src/db/initIndexes.ts";
import compression from "compression";
import { performanceEngine } from "./src/services/performanceEngine.ts";
import { registerRoutes } from "./server/routes/index.ts";

const projectRoot = (() => {
  try {
    return path.resolve(fileURLToPath(new URL(".", import.meta.url)));
  } catch {
    return process.cwd();
  }
})();

process.chdir(projectRoot);

async function startServer() {
  // Initialize database engine (PostgreSQL or PGlite) and auto-seed if required
  await initDatabase();

  // Boot high-performance indexes on database startup
  initializeDatabaseIndexes().catch((err) =>
    console.warn("Index init note:", err?.message || err)
  );

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.disable("x-powered-by");

  // Security headers for production
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    if (req.path.startsWith("/api/")) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    } else if (/\.(js|css|woff2|png|jpg|jpeg|svg|ico|webp|avif)$/.test(req.path)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else if (req.path === "/" || req.path === "/index.html") {
      res.setHeader("Cache-Control", "no-cache");
    }

    next();
  });

  // Performance: HTTP Compression (Gzip / Deflate)
  app.use(compression());
  app.use(express.json({ limit: "50mb" }));

  // Global Performance Telemetry Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      performanceEngine.recordSample(req.path, req.method, duration, res.statusCode);
    });
    next();
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Static File Uploads Serving
  const uploadsDir = path.resolve(projectRoot, "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  // Mount Modular Routes (Controllers + Handlers)
  registerRoutes(app);

  // Development Vite Middleware vs Production Static Serving
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.argv[1]?.endsWith("dist/server.cjs") ||
    process.argv[1]?.includes("\\dist\\server.cjs");

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(projectRoot, "dist");
    app.use(
      express.static(distPath, {
        maxAge: "1y",
        immutable: true,
        index: false,
      })
    );
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      console.log("Server shutdown complete.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error("Fatal startup error:", error);
  process.exit(1);
});
