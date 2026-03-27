#!/usr/bin/env node
/**
 * Generate an image via the Google Gemini API and save it as a PNG.
 *
 * Usage:
 *   node scripts/generate-image.js "A dark minimalist psychology journal cover"
 *
 * Requires GEMINI_API_KEY in .env (project root) or the environment.
 * Output: public/images/generated/<timestamp>.png
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Load .env (no dotenv dependency needed) ────────────────────────────────
function loadDotEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*([\w]+)\s*=\s*"?([^"#\n]*)"?\s*$/);
    if (match) process.env[match[1]] ??= match[2].trim();
  }
}

loadDotEnv();

// ── Validate inputs ────────────────────────────────────────────────────────
const prompt = process.argv.slice(2).join(" ").trim();
if (!prompt) {
  console.error("Error: provide a text prompt as a command-line argument.");
  console.error('  node scripts/generate-image.js "your prompt here"');
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not set in .env or the environment.");
  process.exit(1);
}

// ── Call Gemini API ────────────────────────────────────────────────────────
const MODEL = "gemini-3-pro-image-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

console.log(`Generating image for prompt: "${prompt}"`);

const response = await fetch(`${API_URL}?key=${apiKey}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
  }),
});

if (!response.ok) {
  const body = await response.text();
  console.error(`Gemini API error ${response.status}: ${body}`);
  process.exit(1);
}

const data = await response.json();

// ── Extract image bytes ────────────────────────────────────────────────────
const parts = data?.candidates?.[0]?.content?.parts ?? [];
const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));

if (!imagePart) {
  console.error("No image returned by the API. Full response:");
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}

const imageBytes = Buffer.from(imagePart.inlineData.data, "base64");

// ── Save to disk ───────────────────────────────────────────────────────────
const outDir = path.join(ROOT, "public", "images", "generated");
fs.mkdirSync(outDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outFile = path.join(outDir, `${timestamp}.png`);

fs.writeFileSync(outFile, imageBytes);

const relativePath = path.relative(ROOT, outFile);
console.log(`Image saved: ${relativePath}`);
