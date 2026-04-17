import type { IncomingMessage, ServerResponse } from "http";
import express from "express";
import cookieParser from "cookie-parser";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import pg from "pg";
import portalRoutes from "./portal-routes.js";
import adminRoutes from "./admin-routes.js";

// ── DB setup (inline, no server/ imports) ────────────────────────────────────
const { Pool } = pg;
let _pool: pg.Pool | null = null;

function getPool(): pg.Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be set");
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

// ── Auth helpers (inline) ────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

function generateAuthToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}

function verifyAuthToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

// ── Pattern display names (inline) ───────────────────────────────────────────
const patternDisplayNames: Record<string, string> = {
  disappearing: "The Disappearing Pattern",
  apologyLoop: "The Apology Loop",
  testing: "The Testing Pattern",
  attractionToHarm: "Attraction to Harm",
  complimentDeflection: "Compliment Deflection",
  drainingBond: "The Draining Bond",
  successSabotage: "Success Sabotage",
  perfectionism: "The Perfectionism Pattern",
  rage: "The Rage Pattern",
};

// ── Quiz DB helpers (raw SQL, no Drizzle) ────────────────────────────────────
interface QuizUser {
  id: string;
  email: string;
  name: string | null;
  primaryPattern: string;
  secondaryPatterns: string[];
  patternScores: Record<string, number>;
  accessLevel: string;
  crashCourseDay: number | null;
  crashCourseStarted: Date | null;
  magicLinkToken: string | null;
  magicLinkExpires: Date | null;
}

async function createOrUpdateQuizUser(data: {
  email: string;
  primaryPattern: string;
  secondaryPatterns: string[];
  patternScores: Record<string, number>;
}): Promise<QuizUser> {
  const pool = getPool();
  const token = require("crypto").randomUUID();
  const tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const existing = await pool.query(
    `SELECT id FROM quiz_users WHERE email = $1 LIMIT 1`,
    [data.email]
  );

  let row: any;
  if (existing.rows.length > 0) {
    const result = await pool.query(
      `UPDATE quiz_users
       SET primary_pattern = $1, secondary_patterns = $2, pattern_scores = $3,
           magic_link_token = $4, magic_link_expires = $5
       WHERE email = $6
       RETURNING *`,
      [
        data.primaryPattern,
        JSON.stringify(data.secondaryPatterns),
        JSON.stringify(data.patternScores),
        token,
        tokenExpires,
        data.email,
      ]
    );
    row = result.rows[0];
  } else {
    const result = await pool.query(
      `INSERT INTO quiz_users
         (email, primary_pattern, secondary_patterns, pattern_scores, access_level,
          magic_link_token, magic_link_expires)
       VALUES ($1, $2, $3, $4, 'free', $5, $6)
       RETURNING *`,
      [
        data.email,
        data.primaryPattern,
        JSON.stringify(data.secondaryPatterns),
        JSON.stringify(data.patternScores),
        token,
        tokenExpires,
      ]
    );
    row = result.rows[0];
  }

  return rowToQuizUser(row);
}

async function getQuizUserByToken(token: string): Promise<QuizUser | null> {
  const pool = getPool();
  // First try magic_link_token
  const result = await pool.query(
    `SELECT * FROM quiz_users WHERE magic_link_token = $1 LIMIT 1`,
    [token]
  );
  if (result.rows.length > 0) {
    const user = rowToQuizUser(result.rows[0]);
    if (user.magicLinkExpires && new Date(user.magicLinkExpires) > new Date()) {
      return user;
    }
  }

  // Fall back to JWT verification
  const authData = verifyAuthToken(token);
  if (!authData) return null;

  const jwtResult = await pool.query(
    `SELECT * FROM quiz_users WHERE id = $1 LIMIT 1`,
    [authData.userId]
  );
  return jwtResult.rows.length > 0 ? rowToQuizUser(jwtResult.rows[0]) : null;
}

async function updateQuizUser(id: string, data: Partial<QuizUser>): Promise<void> {
  const pool = getPool();
  const sets: string[] = [];
  const vals: any[] = [];
  let i = 1;

  if (data.crashCourseStarted !== undefined) {
    sets.push(`crash_course_started = $${i++}`);
    vals.push(data.crashCourseStarted);
  }
  if (data.crashCourseDay !== undefined) {
    sets.push(`crash_course_day = $${i++}`);
    vals.push(data.crashCourseDay);
  }

  if (sets.length === 0) return;
  vals.push(id);
  await pool.query(`UPDATE quiz_users SET ${sets.join(", ")} WHERE id = $${i}`, vals);
}

function rowToQuizUser(row: any): QuizUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? null,
    primaryPattern: row.primary_pattern,
    secondaryPatterns: Array.isArray(row.secondary_patterns)
      ? row.secondary_patterns
      : (row.secondary_patterns ? JSON.parse(row.secondary_patterns) : []),
    patternScores: typeof row.pattern_scores === "object" && !Array.isArray(row.pattern_scores)
      ? row.pattern_scores
      : (row.pattern_scores ? JSON.parse(row.pattern_scores) : {}),
    accessLevel: row.access_level ?? "free",
    crashCourseDay: row.crash_course_day ?? null,
    crashCourseStarted: row.crash_course_started ? new Date(row.crash_course_started) : null,
    magicLinkToken: row.magic_link_token ?? null,
    magicLinkExpires: row.magic_link_expires ? new Date(row.magic_link_expires) : null,
  };
}

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function getResend() { return new Resend(process.env.RESEND_API_KEY || "placeholder"); }

// Portal and admin sub-routers (self-contained, no server/ imports)
app.use("/api/portal", portalRoutes);
app.use("/api/admin", adminRoutes);

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
      body: JSON.stringify({ model, max_tokens, system, messages }),
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
      stepInstruction =
        "The user just described what they feel in their body right before their pattern fires. Name what they described as a specific body signal. Validate it as a real neurological pattern marker — not anxiety, not weakness, but their nervous system loading a learned survival response. Then ask exactly this question: 'How long has that feeling been your starting gun?'";
    } else if (step === 2) {
      stepInstruction =
        "The user just told you how long they've been experiencing this body signal before their pattern fires. Reflect their pattern back to them: give it a specific behavioral name (like 'the disappearing pattern' or 'the shutdown sequence' or 'the testing loop'), describe in one sentence what it costs them, and end with exactly this line: 'This is your signal. The method teaches you what to do the moment you feel it.'";
    }

    const messages = [
      ...(history || []),
      {
        role: "user",
        content: `${userInput}\n\n[Internal instruction — do not repeat this to the user: ${stepInstruction}]`,
      },
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

    const data = (await response.json()) as any;
    const text =
      data?.content?.[0]?.text ||
      "Your pattern is speaking. The method is listening.";
    res.json({ response: text });
  } catch (error) {
    console.error("Archivist demo error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// ── /api/quiz/submit — fully inlined, no server/ imports ─────────────────────
app.post("/api/quiz/submit", async (req, res) => {
  try {
    const { email, primaryPattern, secondaryPatterns, patternScores } = req.body;
    if (!email || !primaryPattern) {
      return res.status(400).json({ error: "Email and pattern are required" });
    }

    // 1. Upsert quiz user directly via pg
    const user = await createOrUpdateQuizUser({
      email,
      primaryPattern,
      secondaryPatterns: secondaryPatterns || [],
      patternScores: patternScores || {},
    });

    // 2. Send welcome email via Resend
    const patternName = patternDisplayNames[primaryPattern] || primaryPattern;
    try {
      await getResend().emails.send({
        from: "The Archivist <hello@archiebase.com>",
        to: [email],
        subject: `Your pattern has been identified — ${patternName}`,
        html: `
          <div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;">
            <p style="color:#00FFD1;font-size:12px;letter-spacing:3px;">PATTERN IDENTIFIED</p>
            <h2 style="font-size:28px;">${patternName}</h2>
            <p style="color:#94A3B8;">Your free Crash Course is built specifically for this pattern. Everything inside is designed for how your nervous system works.</p>
            <a href="https://thearchivistmethod.com/portal"
               style="display:inline-block;background:#00FFD1;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-weight:bold;margin-top:20px;">
              START YOUR CRASH COURSE →
            </a>
          </div>
        `,
      });
    } catch (err) {
      console.error("Email send failed:", err);
    }

    // 3. Generate JWT and set cookie
    const jwtToken = generateAuthToken(user.id, email);

    res.cookie("quiz_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    res.json({ success: true, token: jwtToken, userId: user.id });
  } catch (error) {
    console.error("[quiz/submit] error:", error);
    res.status(500).json({ error: "Failed to save quiz submission" });
  }
});

app.get("/api/quiz/user", async (req, res) => {
  try {
    const token =
      req.cookies?.quiz_token ||
      req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await getQuizUserByToken(token);
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
    const token =
      req.cookies?.quiz_token ||
      req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await getQuizUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    if (!user.crashCourseStarted) {
      await updateQuizUser(user.id, {
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
    const token =
      req.cookies?.quiz_token ||
      req.cookies?.auth_token ||
      req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await getQuizUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const purchases = [];
    if (user.accessLevel === "quickstart" || user.accessLevel === "archive") {
      purchases.push({
        productId: "quickstart",
        productName: "The Field Guide",
        purchasedAt: new Date().toISOString(),
      });
    }
    if (user.accessLevel === "archive") {
      purchases.push({
        productId: "archive",
        productName: "Complete Archive",
        purchasedAt: new Date().toISOString(),
      });
    }

    const availableUpgrades = [];
    if (user.accessLevel === "free") {
      availableUpgrades.push({
        id: "quickstart",
        name: "The Field Guide",
        price: 67,
        description: "Your pattern-specific Field Guide, all 9 patterns, crisis protocols",
      });
    }
    if (user.accessLevel !== "archive") {
      availableUpgrades.push({
        id: "archive",
        name: "Complete Archive",
        price: user.accessLevel === "quickstart" ? 230 : 297,
        description: "Pattern combinations, long-term maintenance, advanced applications",
      });
    }

    res.json({
      email: user.email,
      name: user.name || user.email.split("@")[0],
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

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req as any, res as any);
}
