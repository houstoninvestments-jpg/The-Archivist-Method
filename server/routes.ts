import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

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

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const { email, primaryPattern, secondaryPatterns, patternScores } = req.body;
      
      if (!email || !primaryPattern) {
        return res.status(400).json({ error: "Email and pattern are required" });
      }
      
      const user = await storage.createQuizUser({
        email,
        primaryPattern,
        secondaryPatterns: secondaryPatterns || [],
        patternScores: patternScores || {},
      });
      
      console.log(`Quiz submission: ${email} - Primary: ${primaryPattern}`);
      
      res.json({ 
        success: true, 
        token: user.magicLinkToken,
        userId: user.id,
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(500).json({ error: "Failed to save quiz submission" });
    }
  });

  app.get("/api/quiz/user", async (req, res) => {
    try {
      const token = req.cookies?.quiz_token || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const user = await storage.getQuizUserByToken(token);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        primaryPattern: user.primaryPattern,
        secondaryPatterns: user.secondaryPatterns,
        patternScores: user.patternScores,
        accessLevel: user.accessLevel,
        crashCourseDay: user.crashCourseDay,
        crashCourseStarted: user.crashCourseStarted,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  app.post("/api/quiz/start-crash-course", async (req, res) => {
    try {
      const token = req.cookies?.quiz_token || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const user = await storage.getQuizUserByToken(token);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      
      if (!user.crashCourseStarted) {
        await storage.updateQuizUser(user.id, {
          crashCourseStarted: new Date(),
          crashCourseDay: 1,
        });
      }
      
      res.json({ success: true, day: user.crashCourseDay || 1 });
    } catch (error) {
      console.error("Start crash course error:", error);
      res.status(500).json({ error: "Failed to start crash course" });
    }
  });

  app.get("/api/portal/user-data", async (req, res) => {
    try {
      const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const user = await storage.getQuizUserByToken(token);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      
      const purchases = [];
      if (user.accessLevel === 'quickstart' || user.accessLevel === 'archive') {
        purchases.push({
          productId: 'quickstart',
          productName: 'The Field Guide',
          purchasedAt: new Date().toISOString(),
        });
      }
      if (user.accessLevel === 'archive') {
        purchases.push({
          productId: 'archive',
          productName: 'Complete Archive',
          purchasedAt: new Date().toISOString(),
        });
      }
      
      const availableUpgrades = [];
      if (user.accessLevel === 'free') {
        availableUpgrades.push({
          id: 'quickstart',
          name: 'The Field Guide',
          price: 47,
          description: 'Your pattern-specific Field Guide, all 9 patterns, crisis protocols',
        });
      }
      if (user.accessLevel !== 'archive') {
        availableUpgrades.push({
          id: 'archive',
          name: 'Complete Archive',
          price: user.accessLevel === 'quickstart' ? 150 : 197,
          description: 'Pattern combinations, long-term maintenance, advanced applications',
        });
      }
      
      res.json({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        primaryPattern: user.primaryPattern,
        secondaryPatterns: user.secondaryPatterns,
        patternScores: user.patternScores,
        accessLevel: user.accessLevel,
        crashCourseDay: user.crashCourseDay,
        crashCourseStarted: user.crashCourseStarted,
        purchases,
        availableUpgrades,
      });
    } catch (error) {
      console.error("Get portal user data error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  return httpServer;
}
