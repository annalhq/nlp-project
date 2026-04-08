"""Backward-compatible facade for summarization functions.

This module intentionally re-exports the public API used by `main.py`.
Implementation details now live in smaller modules.
"""

from summarization import summarize, summarize_comments_for_solutions, summarize_issue

__all__ = ["summarize", "summarize_issue", "summarize_comments_for_solutions"]