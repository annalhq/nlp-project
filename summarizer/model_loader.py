"""Model and tokenizer loading with singleton cache."""

from __future__ import annotations

from dataclasses import dataclass

import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

from config import DEFAULT_CONFIG, SummarizerConfig


@dataclass
class LoadedModel:
    tokenizer: T5Tokenizer
    model: T5ForConditionalGeneration
    device: torch.device


_MODEL_CACHE: LoadedModel | None = None


def get_loaded_model(config: SummarizerConfig = DEFAULT_CONFIG) -> LoadedModel:
    """Load and cache tokenizer/model once per process."""
    global _MODEL_CACHE

    if _MODEL_CACHE is not None:
        return _MODEL_CACHE

    print(f"[Summarizer] Loading {config.model_name} model and tokenizer...")
    tokenizer = T5Tokenizer.from_pretrained(config.model_name, legacy=False)
    model = T5ForConditionalGeneration.from_pretrained(config.model_name)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    model.eval()
    print(f"[Summarizer] Model loaded on {device}")

    _MODEL_CACHE = LoadedModel(tokenizer=tokenizer, model=model, device=device)
    return _MODEL_CACHE
