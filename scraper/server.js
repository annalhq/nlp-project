import express from "express";
import cors from "cors";
import { extractIssueThread } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 5000;

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

    const result = await extractIssueThread(url);

    res.json({
      success: true,
      data: result,
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
});
