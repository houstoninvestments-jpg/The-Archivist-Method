import { Router, Request, Response } from "express";
import { execFile, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const execFileAsync = promisify(execFile);
const router = Router();

const TEMP_DIR = path.join(process.cwd(), "tmp_transcribe");

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function cleanupFiles(...files: string[]) {
  for (const f of files) {
    try {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    } catch {}
  }
}

// Generate a unique job ID
function jobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Download video audio via yt-dlp
async function downloadAudio(url: string, outputPath: string): Promise<{ title: string; duration: number }> {
  // First get video info
  const { stdout: infoJson } = await execFileAsync("yt-dlp", [
    "--dump-json",
    "--no-download",
    url,
  ], { timeout: 30000 });

  const info = JSON.parse(infoJson);
  const title = info.title || "Untitled";
  const duration = info.duration || 0;

  // Download audio only as mp3
  await execFileAsync("yt-dlp", [
    "-x",
    "--audio-format", "mp3",
    "--audio-quality", "3",
    "-o", outputPath,
    "--no-playlist",
    "--max-filesize", "100M",
    url,
  ], { timeout: 300000 });

  return { title, duration };
}

// Transcribe audio file using OpenAI Whisper API
async function transcribeAudio(audioPath: string): Promise<{
  text: string;
  segments: Array<{ start: number; end: number; text: string }>;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to your environment variables.");
  }

  const openai = new OpenAI({ apiKey });

  // Check file size - Whisper limit is 25MB
  const stats = fs.statSync(audioPath);
  const fileSizeMB = stats.size / (1024 * 1024);

  if (fileSizeMB > 25) {
    // Split into chunks and transcribe each
    return transcribeLargeFile(openai, audioPath);
  }

  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  const result = response as any;
  return {
    text: result.text || "",
    segments: (result.segments || []).map((s: any) => ({
      start: s.start,
      end: s.end,
      text: s.text,
    })),
  };
}

// Split large files and transcribe in chunks
async function transcribeLargeFile(
  openai: OpenAI,
  audioPath: string
): Promise<{ text: string; segments: Array<{ start: number; end: number; text: string }> }> {
  const chunkDir = path.join(TEMP_DIR, `chunks_${Date.now()}`);
  fs.mkdirSync(chunkDir, { recursive: true });

  // Split into 10-minute chunks
  await execFileAsync("ffmpeg", [
    "-i", audioPath,
    "-f", "segment",
    "-segment_time", "600",
    "-c", "copy",
    path.join(chunkDir, "chunk_%03d.mp3"),
  ], { timeout: 120000 });

  const chunks = fs.readdirSync(chunkDir)
    .filter(f => f.startsWith("chunk_"))
    .sort();

  let fullText = "";
  const allSegments: Array<{ start: number; end: number; text: string }> = [];
  let timeOffset = 0;

  for (const chunk of chunks) {
    const chunkPath = path.join(chunkDir, chunk);

    // Get chunk duration for offset calculation
    const { stdout: durationStr } = await execFileAsync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      chunkPath,
    ]);
    const chunkDuration = parseFloat(durationStr.trim()) || 600;

    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(chunkPath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const result = response as any;
    fullText += (result.text || "") + " ";

    if (result.segments) {
      for (const s of result.segments) {
        allSegments.push({
          start: s.start + timeOffset,
          end: s.end + timeOffset,
          text: s.text,
        });
      }
    }

    timeOffset += chunkDuration;
  }

  // Cleanup chunks
  fs.rmSync(chunkDir, { recursive: true, force: true });

  return { text: fullText.trim(), segments: allSegments };
}

// Format seconds to HH:MM:SS
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// POST /api/transcribe - Main transcription endpoint
router.post("/", async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  const id = jobId();
  const audioPath = path.join(TEMP_DIR, `${id}.mp3`);

  try {
    // Step 1: Download audio
    const { title, duration } = await downloadAudio(url, audioPath);

    // yt-dlp may append extension - find the actual file
    let actualAudioPath = audioPath;
    if (!fs.existsSync(audioPath)) {
      const candidates = fs.readdirSync(TEMP_DIR).filter(f => f.startsWith(id));
      if (candidates.length > 0) {
        actualAudioPath = path.join(TEMP_DIR, candidates[0]);
      } else {
        throw new Error("Download completed but audio file not found");
      }
    }

    // Step 2: Transcribe
    const { text, segments } = await transcribeAudio(actualAudioPath);

    // Step 3: Build response
    const timestamped = segments.map(s => `[${formatTime(s.start)}] ${s.text.trim()}`).join("\n");

    res.json({
      id,
      title,
      duration,
      text,
      timestamped,
      segments,
      audioAvailable: true,
    });

    // Keep audio file for download, schedule cleanup after 30 min
    setTimeout(() => cleanupFiles(actualAudioPath), 30 * 60 * 1000);
  } catch (error: any) {
    cleanupFiles(audioPath);
    console.error("Transcription error:", error);

    if (error.message?.includes("OPENAI_API_KEY")) {
      return res.status(500).json({ error: error.message });
    }

    res.status(500).json({
      error: "Failed to transcribe video. Check the URL and try again.",
      details: error.message,
    });
  }
});

// GET /api/transcribe/audio/:id - Download extracted audio
router.get("/audio/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  // Sanitize ID to prevent path traversal
  if (!/^job_\d+_[a-z0-9]+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const files = fs.readdirSync(TEMP_DIR).filter(f => f.startsWith(id));
  if (files.length === 0) {
    return res.status(404).json({ error: "Audio file not found or expired" });
  }

  const filePath = path.join(TEMP_DIR, files[0]);
  res.download(filePath, `transcription_audio.mp3`);
});

// POST /api/transcribe/format - Reformat transcription using Claude
router.post("/format", async (req: Request, res: Response) => {
  const { text, format } = req.body;

  if (!text || !format) {
    return res.status(400).json({ error: "Text and format are required" });
  }

  const prompts: Record<string, string> = {
    summary: "Provide a concise summary of this transcript in 3-5 paragraphs. Capture the key points, main arguments, and conclusions. Do not add any preamble.",
    bullets: "Convert this transcript into clean, organized bullet points. Group related points under clear headings. Do not add any preamble.",
    article: "Rewrite this transcript as a polished, well-structured article. Use proper headings, smooth transitions, and clear paragraphs. Do not add any preamble.",
    threads: "Convert this transcript into a Twitter/X thread format. Each tweet should be under 280 characters. Number them. Make it engaging and punchy. Do not add any preamble.",
    newsletter: "Reformat this transcript as a newsletter-style email. Include a compelling subject line, key takeaways, and a conversational tone. Do not add any preamble.",
  };

  const systemPrompt = prompts[format];
  if (!systemPrompt) {
    return res.status(400).json({ error: `Unknown format: ${format}. Use: ${Object.keys(prompts).join(", ")}` });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: text }],
      }),
    });

    const data = await response.json() as any;
    const formatted = data?.content?.[0]?.text || "";
    res.json({ formatted, format });
  } catch (error: any) {
    console.error("Format error:", error);
    res.status(500).json({ error: "Failed to format transcription" });
  }
});

export default router;
