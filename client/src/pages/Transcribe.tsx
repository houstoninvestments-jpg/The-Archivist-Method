import { useState, useRef } from "react";

const FONT_DISPLAY = "'Bebas Neue', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const COLOR_BG = "#0A0A0A";
const COLOR_SURFACE = "#111111";
const COLOR_BORDER = "rgba(255,255,255,0.08)";
const COLOR_TEXT = "#F5F5F5";
const COLOR_MUTED = "#888888";
const COLOR_TEAL = "#14B8A6";

type ViewMode = "plain" | "timestamped";
type FormatType = "summary" | "bullets" | "article" | "threads" | "newsletter";

interface TranscriptionResult {
  id: string;
  title: string;
  duration: number;
  text: string;
  timestamped: string;
  segments: Array<{ start: number; end: number; text: string }>;
  audioAvailable: boolean;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function Transcribe() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("plain");
  const [copied, setCopied] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const [formattedText, setFormattedText] = useState("");
  const [activeFormat, setActiveFormat] = useState<FormatType | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    setFormattedText("");
    setActiveFormat(null);
    setStatus("Downloading video...");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transcription failed");
      }

      setResult(data);
      setStatus("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const textToCopy = formattedText || (viewMode === "timestamped" ? result?.timestamped : result?.text) || "";
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = async (format: FormatType) => {
    if (!result?.text || formatting) return;

    setFormatting(true);
    setActiveFormat(format);
    setFormattedText("");

    try {
      const response = await fetch("/api/transcribe/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result.text, format }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setFormattedText(data.formatted);
    } catch (err: any) {
      setError(err.message || "Formatting failed");
      setActiveFormat(null);
    } finally {
      setFormatting(false);
    }
  };

  const handleDownloadAudio = () => {
    if (!result?.id) return;
    window.open(`/api/transcribe/audio/${result.id}`, "_blank");
  };

  const displayText = formattedText || (viewMode === "timestamped" ? result?.timestamped : result?.text) || "";

  return (
    <div style={{ background: COLOR_BG, minHeight: "100vh", fontFamily: FONT_BODY, color: COLOR_TEXT }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${COLOR_BORDER}`,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ color: COLOR_MUTED, textDecoration: "none", fontSize: 13, fontFamily: FONT_MONO }}>
            TAM
          </a>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: 2, color: COLOR_TEXT }}>
            TRANSCRIBE
          </span>
        </div>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLOR_MUTED }}>
          DROP ANY VIDEO LINK
        </span>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 24px" }}>
        {/* URL Input */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <div style={{
            display: "flex",
            gap: 8,
            background: COLOR_SURFACE,
            border: `1px solid ${loading ? COLOR_TEAL : COLOR_BORDER}`,
            borderRadius: 8,
            padding: 6,
            transition: "border-color 0.2s",
          }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube, X, or any video URL..."
              disabled={loading}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: COLOR_TEXT,
                fontFamily: FONT_MONO,
                fontSize: 14,
                padding: "12px 16px",
              }}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              style={{
                background: loading ? "transparent" : COLOR_TEAL,
                color: loading ? COLOR_TEAL : "#000",
                border: loading ? `1px solid ${COLOR_TEAL}` : "none",
                borderRadius: 6,
                padding: "12px 28px",
                fontFamily: FONT_DISPLAY,
                fontSize: 16,
                letterSpacing: 1.5,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: !url.trim() ? 0.4 : 1,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "TRANSCRIBING..." : "TRANSCRIBE"}
            </button>
          </div>

          {/* Status / Error */}
          {status && (
            <div style={{
              marginTop: 12,
              fontFamily: FONT_MONO,
              fontSize: 12,
              color: COLOR_TEAL,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span className="animate-pulse" style={{
                width: 6, height: 6, borderRadius: "50%",
                background: COLOR_TEAL, display: "inline-block",
              }} />
              {status}
            </div>
          )}
          {error && (
            <div style={{
              marginTop: 12,
              fontFamily: FONT_MONO,
              fontSize: 12,
              color: "#EF4444",
              padding: "10px 14px",
              background: "rgba(239,68,68,0.08)",
              borderRadius: 6,
              border: "1px solid rgba(239,68,68,0.2)",
            }}>
              {error}
            </div>
          )}
        </form>

        {/* Supported Platforms */}
        {!result && !loading && (
          <div style={{
            textAlign: "center",
            padding: "60px 0",
          }}>
            <div style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: COLOR_MUTED,
              letterSpacing: 2,
              marginBottom: 16,
            }}>
              SUPPORTED PLATFORMS
            </div>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              flexWrap: "wrap",
            }}>
              {["YouTube", "X / Twitter", "Vimeo", "TikTok", "Instagram", "Facebook", "Reddit", "Direct MP4"].map(p => (
                <span key={p} style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  padding: "6px 12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 4,
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Video Info Bar */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{result.title}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLOR_MUTED, marginTop: 4 }}>
                  {formatDuration(result.duration)} {result.segments.length > 0 && ` // ${result.segments.length} segments`}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {/* Audio Download */}
                {result.audioAvailable && (
                  <button
                    onClick={handleDownloadAudio}
                    style={{
                      background: "transparent",
                      border: `1px solid ${COLOR_BORDER}`,
                      color: COLOR_TEXT,
                      borderRadius: 6,
                      padding: "8px 16px",
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = COLOR_TEAL)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = COLOR_BORDER)}
                  >
                    DOWNLOAD MP3
                  </button>
                )}

                {/* Copy */}
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? COLOR_TEAL : "transparent",
                    border: `1px solid ${copied ? COLOR_TEAL : COLOR_BORDER}`,
                    color: copied ? "#000" : COLOR_TEXT,
                    borderRadius: 6,
                    padding: "8px 16px",
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
            </div>

            {/* View Toggle */}
            {!formattedText && (
              <div style={{
                display: "flex",
                gap: 0,
                marginBottom: 16,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: 6,
                overflow: "hidden",
                width: "fit-content",
              }}>
                {(["plain", "timestamped"] as ViewMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      background: viewMode === mode ? "rgba(20,184,166,0.12)" : "transparent",
                      border: "none",
                      borderRight: mode === "plain" ? `1px solid ${COLOR_BORDER}` : "none",
                      color: viewMode === mode ? COLOR_TEAL : COLOR_MUTED,
                      padding: "8px 18px",
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      cursor: "pointer",
                      letterSpacing: 1,
                    }}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Transcription Text */}
            <textarea
              ref={textRef}
              readOnly
              value={displayText}
              style={{
                width: "100%",
                minHeight: 400,
                background: COLOR_SURFACE,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: 8,
                color: COLOR_TEXT,
                fontFamily: FONT_MONO,
                fontSize: 13,
                lineHeight: 1.8,
                padding: 20,
                resize: "vertical",
                outline: "none",
              }}
            />

            {/* Format Options */}
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: COLOR_MUTED,
                letterSpacing: 2,
                marginBottom: 12,
              }}>
                REFORMAT AS
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {([
                  { key: "summary", label: "Summary" },
                  { key: "bullets", label: "Bullet Points" },
                  { key: "article", label: "Article" },
                  { key: "threads", label: "X Thread" },
                  { key: "newsletter", label: "Newsletter" },
                ] as { key: FormatType; label: string }[]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleFormat(key)}
                    disabled={formatting}
                    style={{
                      background: activeFormat === key ? "rgba(20,184,166,0.12)" : "transparent",
                      border: `1px solid ${activeFormat === key ? COLOR_TEAL : COLOR_BORDER}`,
                      color: activeFormat === key ? COLOR_TEAL : COLOR_TEXT,
                      borderRadius: 6,
                      padding: "10px 20px",
                      fontFamily: FONT_MONO,
                      fontSize: 12,
                      cursor: formatting ? "not-allowed" : "pointer",
                      opacity: formatting && activeFormat !== key ? 0.4 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    {formatting && activeFormat === key ? "FORMATTING..." : label.toUpperCase()}
                  </button>
                ))}

                {formattedText && (
                  <button
                    onClick={() => { setFormattedText(""); setActiveFormat(null); }}
                    style={{
                      background: "transparent",
                      border: `1px solid rgba(239,68,68,0.3)`,
                      color: "#EF4444",
                      borderRadius: 6,
                      padding: "10px 20px",
                      fontFamily: FONT_MONO,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    CLEAR FORMAT
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
