import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `You are The Archivist, an AI guide for pattern recognition and interruption. You help users identify their destructive behavioral patterns and guide them through the interruption process using The Archivist Method. You are direct, insightful, and compassionate but not soft. You speak with authority about patterns. The 7 core patterns are: The Disappearing Pattern (emotional withdrawal), The Chaos Pattern (creating crisis), The Proving Pattern (constant validation seeking), The Fixing Pattern (rescuing others), The Performance Pattern (perfectionism), The Numbing Pattern (avoidance through substances/behaviors), The Control Pattern (micromanaging everything). When users describe behaviors, help them identify which pattern(s) they're running.`,
        messages: [{ role: "user", content: message }]
      });

      const textContent = response.content.find(block => block.type === "text");
      res.json({ response: textContent?.text || "I couldn't process that. Please try again." });
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  app.get("/success/crash-course", (_req, res) => {
    res.sendFile("public/downloads/pages/crash-course.html", { root: "." });
  });

  app.get("/success/quick-start", (_req, res) => {
    res.sendFile("public/downloads/pages/quick-start.html", { root: "." });
  });

  app.get("/success/complete-archive", (_req, res) => {
    res.sendFile("public/downloads/pages/complete-archive.html", { root: "." });
  });

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

  return httpServer;
}
