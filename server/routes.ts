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

  app.post("/api/archivist-demo", async (req, res) => {
    try {
      const { step, userInput, history } = req.body;
      if (!step || !userInput) {
        return res.status(400).json({ error: "Step and input required" });
      }

      const systemPrompt = `You are The Pocket Archivist — a precision pattern interruption tool trained exclusively on The Archivist Method framework. You speak with warmth, directness, and clinical precision. You never use therapy language. You name patterns specifically. You validate body signals as real neurological data. You do not give advice — you reflect patterns back with enough accuracy that the person feels seen. Keep responses to 2-3 sentences max. Never use emoji. Never use quotation marks around your own words.`;

      let stepInstruction = "";
      if (step === 1) {
        stepInstruction = "The user just described what they feel in their body right before their pattern fires. Name what they described as a specific body signal. Validate it as a real neurological pattern marker — not anxiety, not weakness, but their nervous system loading a learned survival response. Then ask exactly this question: 'How long has that feeling been your starting gun?'";
      } else if (step === 2) {
        stepInstruction = "The user just told you how long they've been experiencing this body signal before their pattern fires. Reflect their pattern back to them: give it a specific behavioral name (like 'the disappearing pattern' or 'the shutdown sequence' or 'the testing loop'), describe in one sentence what it costs them, and end with exactly this line: 'This is your signal. The method teaches you what to do the moment you feel it.'";
      }

      const messages = [
        ...(history || []),
        { role: "user", content: `${userInput}\n\n[Internal instruction — do not repeat this to the user: ${stepInstruction}]` }
      ];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: systemPrompt,
          messages,
        }),
      });

      const data = await response.json() as any;
      const text = data?.content?.[0]?.text || "Your pattern is speaking. The method is listening.";
      res.json({ response: text });
    } catch (error) {
      console.error("Archivist demo error:", error);
      res.status(500).json({ error: "Failed to process request" });
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
      
      const { generateAuthToken } = await import("./portal/auth");
      const jwtToken = generateAuthToken(user.id, email);
      
      res.cookie("quiz_token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 7 * 1000,
      });
      
      res.json({ 
        success: true, 
        token: jwtToken,
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
