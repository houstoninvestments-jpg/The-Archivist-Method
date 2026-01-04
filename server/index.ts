import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += `:: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// ADD THIS VOICE ENDPOINT HERE
app.post("/api/generate-voice", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await fetch(
      "https://queue.fal.run/fal-ai/chatterbox/text-to-speech/turbo",
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
            "https://thearchivistmethod.com/archivist-voice.mp3",
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

(async () => {
  try {
    console.log("Starting server initialization...");
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`PORT: ${process.env.PORT || "5000 (default)"}`);
    console.log(
      `DATABASE_URL: ${process.env.DATABASE_URL ? "configured" : "NOT SET"}`,
    );

    await registerRoutes(httpServer, app);
    console.log("Routes registered successfully");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    if (process.env.NODE_ENV === "production") {
      console.log("Setting up static file serving for production...");
      serveStatic(app);
      console.log("Static file serving configured");
    } else {
      console.log("Setting up Vite for development...");
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
      console.log("Vite development server configured");
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`serving on port ${port}`);
      },
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
