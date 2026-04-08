import express from "express";
import cors from "cors";
import { extractIssueThread } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 5000;
const SUMMARIZER_URL =
  process.env.SUMMARIZER_URL || "http://localhost:8000";

app.use(cors());
app.use(express.json());

/* ─── helpers ─────────────────────────────────────────────────────────────── */

/** Write a single SSE frame to the response. */
function sseWrite(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

/* ─── Health check ─────────────────────────────────────────────────────────── */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ─── SSE streaming endpoint ──────────────────────────────────────────────── */
/**
 * GET /api/summarize/stream?url=<github-issue-url>
 * Streams pipeline progress as Server-Sent Events, then emits a final
 * `complete` event containing the full JSON result.
 */
app.get("/api/summarize/stream", async (req, res) => {
  const { url } = req.query;

  /* SSE headers */
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering if present
  res.flushHeaders();

  const send = (event, data) => sseWrite(res, event, data);

  /* keep-alive ping every 15 s */
  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 15_000);

  const finish = () => {
    clearInterval(heartbeat);
    res.end();
  };

  try {
    /* ── Validation ── */
    if (!url) {
      send("error", { message: "Missing required query param: url" });
      return finish();
    }

    if (!/^https:\/\/github\.com\/.+\/issues\/\d+/.test(url)) {
      send("error", {
        message:
          "Invalid GitHub issue URL. Expected: https://github.com/<owner>/<repo>/issues/<number>",
      });
      return finish();
    }

    /* ── Stage: init ── */
    send("pipeline", {
      stage: "init",
      message: "Pipeline initialised — validating URL…",
      progress: 5,
    });

    console.log(`[SSE] Processing: ${url}`);

    /* ── Stage: scraping + extracting (via callback) ── */
    const onProgress = (stage, message, progress) => {
      send("pipeline", { stage, message, progress });
    };

    const result = await extractIssueThread(url, onProgress);

    /* ── Stage: summarizing ── */
    send("pipeline", {
      stage: "summarizing",
      message: "Sending extracted data to T5 summarizer…",
      progress: 75,
    });

    let aiSummary = null;
    try {
      console.log(`[SSE] Calling T5 summariser…`);
      const summarizerRes = await fetch(`${SUMMARIZER_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      send("pipeline", {
        stage: "summarizing",
        message: "T5 model is generating summaries…",
        progress: 88,
      });

      if (summarizerRes.ok) {
        aiSummary = await summarizerRes.json();
        send("pipeline", {
          stage: "summarizing",
          message: "Summaries received from model",
          progress: 96,
        });
        console.log(`[SSE] T5 summaries received`);
      } else {
        const errText = await summarizerRes.text();
        console.warn(`[SSE] Summariser returned ${summarizerRes.status}: ${errText}`);
        send("pipeline", {
          stage: "summarizing",
          message: `Summarizer warning: ${summarizerRes.status} — continuing without AI summary`,
          progress: 96,
        });
      }
    } catch (summarizerErr) {
      console.warn(`[SSE] Summariser unavailable: ${summarizerErr.message}`);
      send("pipeline", {
        stage: "summarizing",
        message: "Summarizer service unavailable — proceeding without AI summary",
        progress: 96,
      });
    }

    /* ── Complete ── */
    send("pipeline", {
      stage: "complete",
      message: "Analysis complete!",
      progress: 100,
    });

    send("complete", {
      success: true,
      data: {
        ...result,
        aiSummary: aiSummary || {
          issueSummary:
            "AI summarizer is currently unavailable. Please ensure the Python summarizer service is running on port 8000.",
          commentsSolutionSummary: "AI summarizer is currently unavailable.",
        },
      },
    });
  } catch (error) {
    console.error(`[SSE] Error: ${error.message}`);
    send("error", { message: error.message });
  }

  finish();
});

/* ─── Original REST endpoint (kept for backwards compatibility) ───────────── */
app.post("/api/summarize", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "Missing required field: url",
        message: "Please provide a GitHub issue URL",
      });
    }

    if (!/^https:\/\/github\.com\/.+\/issues\/\d+/.test(url)) {
      return res.status(400).json({
        error: "Invalid GitHub issue URL",
        message:
          "Expected format: https://github.com/<owner>/<repo>/issues/<number>",
      });
    }

    console.log(`[REST] Processing: ${url}`);

    const result = await extractIssueThread(url);

    let aiSummary = null;
    try {
      console.log(`[REST] Sending to T5 summariser…`);
      const summarizerRes = await fetch(`${SUMMARIZER_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (summarizerRes.ok) {
        aiSummary = await summarizerRes.json();
        console.log(`[REST] T5 summaries received`);
      } else {
        const errText = await summarizerRes.text();
        console.warn(`[REST] Summariser ${summarizerRes.status}: ${errText}`);
      }
    } catch (summarizerErr) {
      console.warn(`[REST] Summariser unavailable: ${summarizerErr.message}`);
    }

    res.json({
      success: true,
      data: {
        ...result,
        aiSummary: aiSummary || {
          issueSummary:
            "AI summarizer is currently unavailable. Please ensure the Python summarizer service is running on port 8000.",
          commentsSolutionSummary: "AI summarizer is currently unavailable.",
        },
      },
    });
  } catch (error) {
    console.error(`[REST] Error: ${error.message}`);
    res.status(500).json({ error: "Extraction failed", message: error.message });
  }
});

/* ─── 404 ─────────────────────────────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `${req.method} ${req.path} does not exist`,
  });
});

/* ─── Start ───────────────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`✓ GitHub Issue Summarizer API  →  http://localhost:${PORT}`);
  console.log(`✓ GET  /api/summarize/stream   — SSE streaming endpoint`);
  console.log(`✓ POST /api/summarize          — REST endpoint`);
  console.log(`✓ GET  /health                 — Health check`);
  console.log(`✓ T5 Summarizer URL: ${SUMMARIZER_URL}`);
});
