"""Core summarization pipeline and public summarization functions."""

from __future__ import annotations

import torch

from chunking import chunk_text
from config import DEFAULT_CONFIG, SummarizerConfig
from model_loader import get_loaded_model
from nlp_utils import build_issue_text, build_solution_focused_comment_text


def _generate_summary_for_text(
    text: str,
    *,
    config: SummarizerConfig = DEFAULT_CONFIG,
    max_length: int | None = None,
    min_length: int | None = None,
) -> str:
    if not text.strip():
        return ""

    loaded = get_loaded_model(config)
    tokenizer = loaded.tokenizer
    model = loaded.model
    device = loaded.device

    output_max = max_length or config.max_output_tokens
    output_min = min_length if min_length is not None else config.min_output_tokens
    output_min = min(output_min, max(1, output_max - 1))

    chunks = chunk_text(tokenizer, text, config)
    chunk_summaries: list[str] = []

    for chunk in chunks:
        input_text = "summarize: " + chunk
        input_ids = tokenizer.encode(
            input_text,
            return_tensors="pt",
            max_length=config.max_input_tokens,
            truncation=True,
        ).to(device)

        with torch.no_grad():
            output_ids = model.generate(
                input_ids,
                max_length=output_max,
                min_length=output_min,
                num_beams=config.num_beams,
                length_penalty=config.length_penalty,
                early_stopping=True,
                no_repeat_ngram_size=config.no_repeat_ngram_size,
            )

        summary = tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
        if summary:
            chunk_summaries.append(summary)

    if not chunk_summaries:
        return ""

    if len(chunk_summaries) == 1:
        return chunk_summaries[0]

    combined = " ".join(chunk_summaries)
    # Final condensing pass to keep output coherent without recursive loops.
    return _generate_summary_for_text(
        combined,
        config=config,
        max_length=output_max,
        min_length=output_min,
    ) if len(chunks) > 1 and len(combined) > 0 and len(combined) < len(text) else combined


def summarize(text: str, *, max_length: int | None = None, min_length: int | None = None) -> str:
    return _generate_summary_for_text(
        text,
        config=DEFAULT_CONFIG,
        max_length=max_length,
        min_length=min_length,
    )


def summarize_issue(body: str) -> str:
    return summarize(build_issue_text(body))


def summarize_comments_for_solutions(comments: list[dict]) -> str:
    if not comments:
        return "No comments available to analyze for solutions."

    combined = build_solution_focused_comment_text(comments)
    if not combined:
        return "No substantive comments found."

    summary = summarize(combined)
    return summary or "No clear solution-oriented content found."
