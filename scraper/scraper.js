import puppeteer from "puppeteer";
import sanitize from "sanitize-html";
import fs from "fs";
import path from "path";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

async function extractAuthor(page, selector) {
  return page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return null;

    const links = Array.from(root.querySelectorAll("a"));
    const author = links.find((el) =>
      /ActivityHeader-module__AuthorName/.test(el.className),
    );

    if (!author) return null;

    const username = author.href
      ? author.href.replace(/.*github\.com\//, "").split("/")[0]
      : null;

    return {
      displayName: author.textContent.trim(),
      username,
    };
  }, selector);
}

async function extractTime(page, selector) {
  return page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return null;

    const el = root.querySelector("relative-time");
    if (!el) return null;

    return {
      datetime: el.getAttribute("datetime") || null,
      label: el.getAttribute("title") || el.textContent.trim(),
    };
  }, selector);
}

async function extractBody(page, selector) {
  return page.evaluate((sel) => {
    const header = document.querySelector(sel);
    if (!header) return null;

    const container = header.nextElementSibling;
    if (!container) return null;

    const body =
      container.querySelector('[data-testid="markdown-body"]') ||
      container.querySelector(".markdown-body") ||
      container;

    return body ? body.innerHTML.trim() : null;
  }, selector);
}

function sanitizeToPlainText(html) {
  if (!html) return "";

  return sanitize(html, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* -------------------------------------------------------------------------- */
/* main
/* -------------------------------------------------------------------------- */

export async function extractIssueThread(issueUrl) {
  console.log("\nStarting browser...");

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/123.0.0.0 Safari/537.36",
  );

  await page.setViewport({ width: 1280, height: 900 });

  console.log("Opening issue page:");
  console.log(issueUrl);

  await page.goto(issueUrl, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  try {
    await page.waitForSelector("#issue-body-viewer", { timeout: 20000 });
  } catch {
    throw new Error(
      "Could not locate issue body. Verify the URL points to a GitHub issue.",
    );
  }

  /* ---------------------------- issue metadata ---------------------------- */

  const issueTitle = await page.evaluate(() => {
    const el = document.querySelector("h1.gh-header-title bdi");
    return el ? el.textContent.trim() : document.title;
  });

  const issueNumber = await page.evaluate(() => {
    const el = document.querySelector("h1.gh-header-title .f1-light");
    return el ? el.textContent.replace(/\D/g, "") : null;
  });

  console.log("Extracting main issue...");

  const issueSelector = "#issue-body-viewer";

  const mainIssueAuthor = await page.evaluate(() => {
    const author =
      document.querySelector('[data-testid="issue-body-header-author"]') ||
      document.querySelector(
        'a[class*="IssueBodyHeaderAuthor-module__authorLoginLink"]',
      );

    if (!author) return null;

    const username = author.href
      ? author.href.replace(/.*github\.com\//, "").split("/")[0]
      : null;

    return {
      displayName: author.textContent.trim(),
      username,
    };
  });

  const mainIssueBody = await page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return null;

    const body =
      root.querySelector('[data-testid="markdown-body"]') ||
      root.querySelector(".markdown-body") ||
      root;

    return body ? body.innerHTML.trim() : null;
  }, issueSelector);

  const mainIssue = {
    type: "issue",
    title: issueTitle,
    number: issueNumber ? `#${issueNumber}` : null,
    author: mainIssueAuthor,
    postedAt: await extractTime(page, issueSelector),
    body: sanitizeToPlainText(mainIssueBody),
  };

  /* ------------------------------ comments -------------------------------- */

  console.log("Scanning for comments...");

  const commentIds = await page.evaluate(() => {
    const regex = /^issuecomment-\d+$/;

    return Array.from(document.querySelectorAll("[id]"))
      .map((el) => el.id)
      .filter((id) => regex.test(id));
  });

  console.log(`Found ${commentIds.length} comments`);

  const comments = [];

  for (const id of commentIds) {
    const selector = `#${id}`;

    const author = await extractAuthor(page, selector);
    const time = await extractTime(page, selector);
    const unsanitizedBody = await extractBody(page, selector);
    const body = sanitizeToPlainText(unsanitizedBody);

    const numericId = id.replace("issuecomment-", "");

    comments.push({
      type: "comment",
      id: numericId,
      anchor: id,
      author,
      postedAt: time,
      body,
    });

    console.log(
      `Comment ${numericId} extracted (${author?.username ?? "unknown"})`,
    );
  }

  await browser.close();
  console.log("Browser closed\n");

  /* ------------------------------- result --------------------------------- */

  return {
    url: issueUrl,
    extractedAt: new Date().toISOString(),
    issue: mainIssue,
    comments,
    summary: {
      totalComments: comments.length,
      participants: [
        ...new Set(
          [
            mainIssue.author?.username,
            ...comments.map((c) => c.author?.username),
          ].filter(Boolean),
        ),
      ],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* CLI Entry (only runs when this file is executed directly)                 */
/* -------------------------------------------------------------------------- */

if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const args = process.argv.slice(2);
    const issueUrl = args[0];
    const outputFile = args[1] || "issue-thread.json";

    if (!issueUrl) {
      console.error(
        "Usage: node github-issue-extractor.js <issue-url> [output.json]",
      );
      process.exit(1);
    }

    if (!/^https:\/\/github\.com\/.+\/issues\/\d+/.test(issueUrl)) {
      console.error("Invalid GitHub issue URL.");
      console.error("Expected format:");
      console.error("https://github.com/<owner>/<repo>/issues/<number>");
      process.exit(1);
    }

    try {
      const result = await extractIssueThread(issueUrl);

      const outPath = path.resolve(outputFile);
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");

      console.log("Extraction complete");
      console.log(`Output file: ${outPath}`);
      console.log(`Issue title: ${result.issue.title}`);
      console.log(`Issue author: ${result.issue.author?.username ?? "unknown"}`);
      console.log(`Total comments: ${result.summary.totalComments}`);
      console.log(`Participants: ${result.summary.participants.join(", ")}`);
    } catch (err) {
      console.error("Extraction failed:");
      console.error(err.message);
      process.exit(1);
    }
  })();
}
