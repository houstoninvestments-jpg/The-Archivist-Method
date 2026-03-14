import type { IncomingMessage, ServerResponse } from "http";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }

  let email: string;
  let primaryPattern: string;
  let secondaryPatterns: string[];
  let patternScores: Record<string, number>;

  try {
    ({ email, primaryPattern, secondaryPatterns, patternScores } = JSON.parse(body));
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  if (!email || !primaryPattern) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing required fields: email, primaryPattern" }));
    return;
  }

  // Upsert user into quiz_users table
  const { error: dbError } = await supabase.from("quiz_users").upsert(
    {
      email,
      primary_pattern: primaryPattern,
      secondary_patterns: secondaryPatterns ?? [],
      pattern_scores: patternScores ?? {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );

  if (dbError) {
    console.error("Supabase upsert error:", dbError);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Database error", details: dbError.message }));
    return;
  }

  // Send confirmation email
  const { error: emailError } = await resend.emails.send({
    from: "The Archivist Method <noreply@thearchivistmethod.com>",
    to: email,
    subject: "Your Pattern Analysis Results",
    html: `
      <div style="background:#000;color:#FAFAFA;font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;">
        <h1 style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#14B8A6;margin:0 0 8px;">
          THE ARCHIVIST METHOD
        </h1>
        <p style="color:#9CA3AF;font-size:12px;font-family:'JetBrains Mono',monospace;margin:0 0 32px;letter-spacing:0.1em;">
          PATTERN ARCHAEOLOGY, <span style="color:#EC4899;">NOT</span> THERAPY
        </p>

        <h2 style="font-size:20px;font-weight:600;margin:0 0 16px;">Your results are in.</h2>

        <p style="color:#D1D5DB;line-height:1.6;margin:0 0 24px;">
          Your primary pattern has been identified as:
        </p>

        <div style="background:#111;border:1px solid #14B8A6;border-radius:8px;padding:20px 24px;margin:0 0 24px;">
          <p style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#14B8A6;margin:0;">
            ${primaryPattern}
          </p>
        </div>

        ${
          secondaryPatterns && secondaryPatterns.length > 0
            ? `<p style="color:#D1D5DB;line-height:1.6;margin:0 0 8px;">Secondary patterns detected:</p>
               <p style="color:#9CA3AF;font-size:14px;margin:0 0 24px;">${secondaryPatterns.join(", ")}</p>`
            : ""
        }

        <p style="color:#D1D5DB;line-height:1.6;margin:0 0 32px;">
          Ready to go deeper? The Field Guide gives you the full archaeological map of your patterns —
          what drives them, how they show up, and how to work with them instead of against them.
        </p>

        <a href="https://thearchivistmethod.com/results"
           style="display:inline-block;background:#14B8A6;color:#000;font-weight:700;padding:14px 28px;border-radius:6px;text-decoration:none;font-size:14px;letter-spacing:0.05em;">
          VIEW YOUR FULL RESULTS
        </a>

        <p style="color:#6B7280;font-size:12px;margin:40px 0 0;">
          You're receiving this because you completed the pattern assessment at thearchivistmethod.com.
        </p>
      </div>
    `,
  });

  if (emailError) {
    console.error("Resend email error:", emailError);
    // Don't fail the request — DB write succeeded, email is best-effort
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: true }));
}
