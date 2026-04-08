"""Chunking helpers for long input texts."""

from __future__ import annotations

from typing import List

from config import DEFAULT_CONFIG, SummarizerConfig


def chunk_text(tokenizer, text: str, config: SummarizerConfig = DEFAULT_CONFIG) -> List[str]:
    """Split text into token-aware chunks that fit model input size."""
    prefix = "summarize: "
    prefix_ids = tokenizer.encode(prefix, add_special_tokens=False)
    budget = config.max_input_tokens - len(prefix_ids) - 1

    if budget <= 0:
        return [text]

    token_ids = tokenizer.encode(text, add_special_tokens=False)
    if not token_ids:
        return [""]

    chunks: List[str] = []
    start = 0

    while start < len(token_ids):
        end = min(start + budget, len(token_ids))
        chunk_ids = token_ids[start:end]
        chunks.append(tokenizer.decode(chunk_ids, skip_special_tokens=True))

        if end >= len(token_ids):
            break

        next_start = end - config.overlap_tokens
        start = max(next_start, start + 1)

    return chunks
