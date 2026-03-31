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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function summarizeIssue(url: string): Promise<IssueData> {
  try {
    const response = await fetch(`${API_URL}/api/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
        `API error: ${response.status} ${response.statusText}`
      );
    }

    const data: ApiResponse = await response.json();

    if (!data.success) {
      throw new Error("API returned unsuccessful response");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract issue: ${error.message}`);
    }
    throw new Error("Failed to extract issue: Unknown error");
  }
}
