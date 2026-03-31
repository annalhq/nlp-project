"""
FastAPI server for the T5 text summariser.
Receives scraped GitHub issue data and returns AI-generated summaries.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from summarizer import summarize_issue, summarize_comments_for_solutions

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class Author(BaseModel):
    displayName: str | None = None
    username: str | None = None


class TimeInfo(BaseModel):
    datetime: str | None = None
    label: str | None = None


class Issue(BaseModel):
    type: str | None = None
    title: str | None = None
    number: str | None = None
    author: Author | None = None
    postedAt: TimeInfo | None = None
    body: str | None = None


class Comment(BaseModel):
    type: str | None = None
    id: str | None = None
    anchor: str | None = None
    author: Author | None = None
    postedAt: TimeInfo | None = None
    body: str | None = None


class SummaryMeta(BaseModel):
    totalComments: int = 0
    participants: list[str] = []


class SummarizeRequest(BaseModel):
    url: str
    extractedAt: str | None = None
    issue: Issue
    comments: list[Comment] = []
    summary: SummaryMeta | None = None


class SummarizeResponse(BaseModel):
    issueSummary: str
    commentsSolutionSummary: str


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(
    title="GitBrief Summarizer",
    description="T5-based summariser for GitHub issue threads",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "model": "t5-small"}


@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize_endpoint(payload: SummarizeRequest):
    """Receive scraped issue data and return T5 summaries."""
    try:
        issue_body = payload.issue.body or ""
        comments_dicts = [c.model_dump() for c in payload.comments]

        issue_summary = summarize_issue(issue_body)
        comments_solution_summary = summarize_comments_for_solutions(comments_dicts)

        return SummarizeResponse(
            issueSummary=issue_summary,
            commentsSolutionSummary=comments_solution_summary,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
