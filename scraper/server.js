import express from "express";
import cors from "cors";
import { extractIssueThread } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 5000;
const SUMMARIZER_URL =
  process.env.SUMMARIZER_URL || "http://localhost:8000";

app.use(cors());
app.use(express.json());

/* Health check endpoint */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* Main summarize endpoint */
app.post("/api/summarize", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "Missing required field: url",
        message: "Please provide a GitHub issue URL",
      });
    }

    // Validate GitHub issue URL format
    if (!/^https:\/\/github\.com\/.+\/issues\/\d+/.test(url)) {
      return res.status(400).json({
        error: "Invalid GitHub issue URL",
        message:
          "Expected format: https://github.com/<owner>/<repo>/issues/<number>",
      });
    }

    console.log(`[${new Date().toISOString()}] Processing: ${url}`);

    // Step 1: Scrape the issue
    const result = await extractIssueThread(url);

    // Step 2: Send scraped data to the Python T5 summariser
    let aiSummary = null;
    try {
      console.log(
        `[${new Date().toISOString()}] Sending to T5 summariser…`,
      );
      const summarizerRes = await fetch(`${SUMMARIZER_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (summarizerRes.ok) {
        aiSummary = await summarizerRes.json();
        console.log(
          `[${new Date().toISOString()}] T5 summaries received`,
        );
      } else {
        const errText = await summarizerRes.text();
        console.warn(
          `[${new Date().toISOString()}] Summariser returned ${summarizerRes.status}: ${errText}`,
        );
      }
    } catch (summarizerErr) {
      console.warn(
        `[${new Date().toISOString()}] Summariser unavailable: ${summarizerErr.message}`,
      );
    }

    res.json({
      success: true,
      data: {
        ...result,
        aiSummary: aiSummary || {
          issueSummary:
            "AI summarizer is currently unavailable. Please ensure the Python summarizer service is running on port 8000.",
          commentsSolutionSummary:
            "AI summarizer is currently unavailable.",
        },
      },
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error: ${error.message}`);

    res.status(500).json({
      error: "Extraction failed",
      message: error.message,
    });
  }
});

/* 404 handler */
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `${req.method} ${req.path} does not exist`,
  });
});

/* Start server */
app.listen(PORT, () => {
  console.log(
    `✓ GitHub Issue Summarizer API running on http://localhost:${PORT}`,
  );
  console.log(`✓ POST /api/summarize - Extract GitHub issue thread`);
  console.log(`✓ GET /health - Health check`);
  console.log(`✓ T5 Summarizer URL: ${SUMMARIZER_URL}`);
});
