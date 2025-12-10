import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Health check endpoint for deployment verification
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // put application routes here
  // Download success pages
  app.get("/success/crash-course", (_req, res) => {
    res.sendFile("public/downloads/pages/crash-course.html", { root: "." });
  });

  app.get("/success/quick-start", (_req, res) => {
    res.sendFile("public/downloads/pages/quick-start.html", { root: "." });
  });

  app.get("/success/complete-archive", (_req, res) => {
    res.sendFile("public/downloads/pages/complete-archive.html", { root: "." });
  });

  // PDF download routes
  app.get("/api/download/crash-course", (_req, res) => {
    res.download(
      "public/downloads/free/THE-ARCHIVIST-METHOD-7-DAY-CRASH-COURSE.pdf",
      "The-Archivist-Method-7-Day-Crash-Course.pdf",
    );
  });

  app.get("/api/download/quick-start", (_req, res) => {
    res.download(
      "public/downloads/paid-47/THE-ARCHIVIST-METHOD-QUICK-START.pdf",
      "The-Archivist-Method-Quick-Start.pdf",
    );
  });

  app.get("/api/download/bonus-daily-tracker", (_req, res) => {
    res.download(
      "public/downloads/paid-47/BONUS-1-Daily-Tracker-Archivist-Method.pdf",
      "Bonus-Daily-Tracker.pdf",
    );
  });

  app.get("/api/download/bonus-weekly-review", (_req, res) => {
    res.download(
      "public/downloads/paid-47/BONUS-2-Weekly-Review-Archivist-Method.pdf",
      "Bonus-Weekly-Review.pdf",
    );
  });

  app.get("/api/download/bonus-emergency-cards", (_req, res) => {
    res.download(
      "public/downloads/paid-47/BONUS-3-Emergency-Cards-Archivist-Method.pdf",
      "Bonus-Emergency-Cards.pdf",
    );
  });

  app.get("/api/download/complete-archive", (_req, res) => {
    res.download(
      "public/downloads/paid-197/THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf",
      "The-Archivist-Method-Complete-Archive.pdf",
    );
  });
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}
