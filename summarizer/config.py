"""Configuration for summarization pipeline."""

from dataclasses import dataclass


@dataclass(frozen=True)
class SummarizerConfig:
    model_name: str = "t5-small"
    max_input_tokens: int = 512
    max_output_tokens: int = 220
    min_output_tokens: int = 80
    overlap_tokens: int = 50
    num_beams: int = 4
    length_penalty: float = 2.0
    no_repeat_ngram_size: int = 3


DEFAULT_CONFIG = SummarizerConfig()
