import { initSentry, Sentry } from "./sentry";
initSentry();

import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import portalRoutes from "./portal/routes";
import adminRoutes from "./admin/routes";
import path from "path";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function createApp() {
  const app = express();

  app.use(compression());
  app.use(cookieParser());

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as any).rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        log(logLine);
      }
    });

    next();
  });

  // PORTAL ROUTES
  app.use("/api/portal", portalRoutes);

  // ADMIN ROUTES
  app.use("/api/admin", adminRoutes);

  // Serve robots.txt from public directory
  app.get("/robots.txt", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "robots.txt"));
  });

  // Serve static files from public/downloads (before Vite middleware)
  app.use("/downloads", express.static(path.join(process.cwd(), "public", "downloads")));

  // Serve generated PDFs
  app.use("/generated_pdfs", express.static(path.join(process.cwd(), "generated_pdfs")));

  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (status >= 500) {
      try { Sentry.captureException(err); } catch { /* sentry disabled */ }
    }
    res.status(status).json({ message });
    throw err;
  });

  return { app, httpServer };
}

// Only start listening when run directly (not imported as a serverless handler)
if (process.env.VERCEL !== "1") {
  (async () => {
    try {
      console.log("Starting server initialization...");
      console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
      console.log(`PORT: ${process.env.PORT || "5000 (default)"}`);
      console.log(
        `DATABASE_URL: ${process.env.DATABASE_URL ? "configured" : "NOT SET"}`,
      );

      const { app, httpServer } = await createApp();

      if (process.env.NODE_ENV === "production") {
        console.log("Setting up static file serving for production...");
        serveStatic(app);
        console.log("Static file serving configured");
      } else {
        console.log("Setting up Vite for development...");
        const { setupVite } = await import("./vite");
        await setupVite(httpServer, app);
        console.log("Vite development server configured");
      }

      const port = parseInt(process.env.PORT || "5000", 10);
      httpServer.listen(
        {
          port,
          host: "0.0.0.0",
          reusePort: true,
        },
        () => {
          log(`serving on port ${port}`);
        },
      );
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  })();
}
