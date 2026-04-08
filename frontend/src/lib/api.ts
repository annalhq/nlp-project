export interface AiSummary {
  issueSummary: string;
  commentsSolutionSummary: string;
}

export interface IssueData {
  url: string;
  extractedAt: string;
  issue: {
    type: string;
    title: string;
    number: string;
    author: {
      displayName: string;
      username: string;
    } | null;
    postedAt: {
      datetime: string;
      label: string;
    } | null;
    body: string;
  };
  comments: Array<{
    type: string;
    id: string;
    anchor: string;
    author: {
      displayName: string;
      username: string;
    } | null;
    postedAt: {
      datetime: string;
      label: string;
    } | null;
    body: string;
  }>;
  summary: {
    totalComments: number;
    participants: string[];
  };
  aiSummary: AiSummary;
}

export interface ApiResponse {
  success: boolean;
  data: IssueData;
}

// ── Pipeline event types ────────────────────────────────────────────────────

export type PipelineStage = "init" | "scraping" | "extracting" | "summarizing" | "complete" | "error";

export interface PipelineEvent {
  stage: PipelineStage;
  message: string;
  progress: number;
}

export interface StreamCallbacks {
  onPipeline: (event: PipelineEvent) => void;
  onComplete: (data: IssueData) => void;
  onError: (message: string) => void;
}

// ── Constants ────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── SSE streaming ─────────────────────────────────────────────────────────────

/**
 * Open an SSE stream to the scraper backend that fires real-time pipeline
 * events.  Returns a cleanup function that closes the connection.
 */
export function streamSummarize(url: string, callbacks: StreamCallbacks): () => void {
  const { onPipeline, onComplete, onError } = callbacks;

  const encoded = encodeURIComponent(url);
  const src = new EventSource(`${API_URL}/api/summarize/stream?url=${encoded}`);

  src.addEventListener("pipeline", (e: MessageEvent) => {
    try {
      const event: PipelineEvent = JSON.parse(e.data);
      onPipeline(event);
    } catch {
      // ignore parse errors
    }
  });

  src.addEventListener("complete", (e: MessageEvent) => {
    try {
      const payload: ApiResponse = JSON.parse(e.data);
      onComplete(payload.data);
    } catch {
      onError("Failed to parse completion data");
    } finally {
      src.close();
    }
  });

  src.addEventListener("error", (e: MessageEvent) => {
    // If e.data is defined it's our explicit error event, otherwise it's a
    // network-level EventSource error.
    if (e.data) {
      try {
        const payload = JSON.parse(e.data);
        onError(payload.message ?? "Unknown pipeline error");
      } catch {
        onError("Stream error");
      }
    } else {
      onError("Connection to the scraper service failed. Make sure it is running on port 5000.");
    }
    src.close();
  });

  // Return cleanup function for React effect cleanup
  return () => src.close();
}

// ── Legacy REST (kept for reference) ─────────────────────────────────────────

export async function summarizeIssue(url: string): Promise<IssueData> {
  const response = await fetch(`${API_URL}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message ||
        `API error: ${response.status} ${response.statusText}`
    );
  }

  const data: ApiResponse = await response.json();

  if (!data.success) throw new Error("API returned unsuccessful response");

  return data.data;
}
