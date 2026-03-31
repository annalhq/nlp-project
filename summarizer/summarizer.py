"""
T5-based text summarizer module.
Uses the t5-small model for summarizing GitHub issue bodies and comments.
"""

from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch

# ---------------------------------------------------------------------------
# Model loading (singleton – loaded once when the module is first imported)
# ---------------------------------------------------------------------------

MODEL_NAME = "t5-small"

print(f"[Summarizer] Loading {MODEL_NAME} model & tokenizer …")
tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME, legacy=False)
model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
model.eval()
print(f"[Summarizer] Model loaded on {device}")


# ---------------------------------------------------------------------------
# Chunked summarisation helpers
# ---------------------------------------------------------------------------

MAX_INPUT_TOKENS = 512          # T5-small max input length
MAX_OUTPUT_TOKENS = 150         # summary length cap
OVERLAP_TOKENS = 50             # overlap between chunks for continuity


def _chunk_text(text: str, max_tokens: int = MAX_INPUT_TOKENS) -> list[str]:
    """Split text into chunks that each fit within *max_tokens* (with the
    ``summarize:`` prefix accounted for)."""
    prefix = "summarize: "
    prefix_ids = tokenizer.encode(prefix, add_special_tokens=False)
    budget = max_tokens - len(prefix_ids) - 1          # leave room for </s>

    token_ids = tokenizer.encode(text, add_special_tokens=False)
    chunks: list[str] = []
    start = 0
    while start < len(token_ids):
        end = start + budget
        chunk_ids = token_ids[start:end]
        chunk_text = tokenizer.decode(chunk_ids, skip_special_tokens=True)
        chunks.append(chunk_text)
        start = end - OVERLAP_TOKENS if end < len(token_ids) else end
    return chunks if chunks else [""]


def summarize(text: str, *, max_length: int = MAX_OUTPUT_TOKENS,
              min_length: int = 30) -> str:
    """Summarise *text* using T5.  Long texts are automatically chunked and
    each chunk summarised, then the chunk summaries are combined and
    re-summarised into a single output."""

    if not text or not text.strip():
        return ""

    chunks = _chunk_text(text)

    chunk_summaries: list[str] = []
    for chunk in chunks:
        input_text = "summarize: " + chunk
        input_ids = tokenizer.encode(
            input_text,
            return_tensors="pt",
            max_length=MAX_INPUT_TOKENS,
            truncation=True,
        ).to(device)

        with torch.no_grad():
            output_ids = model.generate(
                input_ids,
                max_length=max_length,
                min_length=min(min_length, max_length - 1),
                length_penalty=2.0,
                num_beams=4,
                early_stopping=True,
                no_repeat_ngram_size=3,
            )

        summary = tokenizer.decode(output_ids[0], skip_special_tokens=True)
        chunk_summaries.append(summary)

    # If there was only one chunk we're done
    if len(chunk_summaries) == 1:
        return chunk_summaries[0]

    # Otherwise combine chunk summaries and do a final pass
    combined = " ".join(chunk_summaries)
    return summarize(combined, max_length=max_length, min_length=min_length)


def summarize_issue(body: str) -> str:
    """Summarise a GitHub issue body."""
    return summarize(body)


def summarize_comments_for_solutions(comments: list[dict]) -> str:
    """Combine all comments and extract a summary focused on potential
    solutions / workarounds mentioned in the discussion."""

    if not comments:
        return "No comments available to analyze for solutions."

    # Build a combined text focused on solution-oriented content
    parts: list[str] = []
    for i, comment in enumerate(comments, 1):
        author = comment.get("author", {})
        username = author.get("username", "unknown") if author else "unknown"
        body = comment.get("body", "").strip()
        if body:
            parts.append(f"Comment by {username}: {body}")

    combined = "\n\n".join(parts)

    if not combined.strip():
        return "No substantive comments found."

    # Prefix prompt to steer T5 towards solution extraction
    solution_prompt = (
        "summarize the following discussion highlighting "
        "proposed solutions and workarounds: " + combined
    )

    # Use the chunking pipeline directly
    chunks = _chunk_text(solution_prompt)
    chunk_summaries: list[str] = []
    for chunk in chunks:
        input_text = "summarize: " + chunk
        input_ids = tokenizer.encode(
            input_text,
            return_tensors="pt",
            max_length=MAX_INPUT_TOKENS,
            truncation=True,
        ).to(device)

        with torch.no_grad():
            output_ids = model.generate(
                input_ids,
                max_length=MAX_OUTPUT_TOKENS,
                min_length=30,
                length_penalty=2.0,
                num_beams=4,
                early_stopping=True,
                no_repeat_ngram_size=3,
            )

        summary = tokenizer.decode(output_ids[0], skip_special_tokens=True)
        chunk_summaries.append(summary)

    if len(chunk_summaries) == 1:
        return chunk_summaries[0]

    combined_summaries = " ".join(chunk_summaries)
    return summarize(combined_summaries)
