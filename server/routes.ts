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

  // Chat endpoint for Archivist AI
  app.post("/api/chat", async (req, res) => {
    try {
      const { model, max_tokens, system, messages } = req.body;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens,
          system,
          messages,
        }),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Claude API Error:", error);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  // Voice generation endpoint - FIXED URL
  app.post("/api/generate-voice", async (req, res) => {
    try {
      const { text } = req.body;
      const response = await fetch(
        "https://fal.run/fal-ai/chatterbox/text-to-speech/turbo",
        {
          method: "POST",
          headers: {
            Authorization:
              "Key c674d6c9-5450-443c-9985-10c8039d6726:bfc3b7413e748b4391d814d871e3a185",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.replace(/\[.*?\]/g, ""),
            reference_audio_url:
              "https://thearchivistmethod.com/the-archivist-voice.mp3",
            exaggeration: 0.3,
            cfg: 0.4,
          }),
        },
      );

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Voice generation error:", error);
      res.status(500).json({ error: "Voice generation failed" });
    }
  });

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

  // Quiz submission endpoint
  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const { email, pattern, timestamp } = req.body;
      
      if (!email || !pattern) {
        return res.status(400).json({ error: "Email and pattern are required" });
      }
      
      // Store quiz submission
      await storage.createQuizSubmission({
        email,
        pattern,
        submittedAt: new Date(timestamp || Date.now())
      });
      
      console.log(`Quiz submission: ${email} - Pattern: ${pattern}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(500).json({ error: "Failed to save quiz submission" });
    }
  });

  return httpServer;
}
