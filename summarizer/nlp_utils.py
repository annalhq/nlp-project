"""NLP-oriented text preparation utilities."""

from __future__ import annotations


def build_issue_text(body: str | None) -> str:
    return (body or "").strip()


def build_solution_focused_comment_text(comments: list[dict]) -> str:
    """Prepare a prompt-oriented comment corpus emphasizing solutions."""
    if not comments:
        return ""

    parts: list[str] = []
    for comment in comments:
        author = comment.get("author") or {}
        username = author.get("username") or "unknown"
        body = (comment.get("body") or "").strip()
        if not body:
            continue
        parts.append(f"Comment by {username}: {body}")

    if not parts:
        return ""

    combined = "\n\n".join(parts)
    return (
        "summarize the following discussion highlighting "
        "proposed solutions and workarounds: " + combined
    )
