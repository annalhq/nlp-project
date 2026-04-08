"use client";

import { useState, useRef, useCallback } from "react";
import { streamSummarize, IssueData, PipelineEvent, PipelineStage } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PipelineStep {
  stage: PipelineStage;
  message: string;
  progress: number;
  timestamp: number;
}

export interface UseSummarizerState {
  data: IssueData | null;
  loading: boolean;
  error: string | null;
  /** Live progress 0–100 */
  progress: number;
  /** Current pipeline stage */
  currentStage: PipelineStage | null;
  /** All pipeline events received so far */
  pipelineLog: PipelineStep[];
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useSummarizer() {
  const [state, setState] = useState<UseSummarizerState>({
    data: null,
    loading: false,
    error: null,
    progress: 0,
    currentStage: null,
    pipelineLog: [],
  });

  // Ref to cancel in-flight SSE stream
  const closeRef = useRef<(() => void) | null>(null);

  const execute = useCallback((url: string) => {
    // Cancel any pre-existing stream
    closeRef.current?.();

    // Reset to loading state
    setState({
      data: null,
      loading: true,
      error: null,
      progress: 0,
      currentStage: "init",
      pipelineLog: [],
    });

    const close = streamSummarize(url, {
      onPipeline(event: PipelineEvent) {
        const step: PipelineStep = {
          stage: event.stage,
          message: event.message,
          progress: event.progress,
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          progress: event.progress,
          currentStage: event.stage,
          pipelineLog: [...prev.pipelineLog, step],
        }));
      },

      onComplete(data: IssueData) {
        const doneStep: PipelineStep = {
          stage: "complete",
          message: "✓ Pipeline finished successfully",
          progress: 100,
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          data,
          loading: false,
          error: null,
          progress: 100,
          currentStage: "complete",
          pipelineLog: [...prev.pipelineLog, doneStep],
        }));
      },

      onError(message: string) {
        const errStep: PipelineStep = {
          stage: "error",
          message: `✗ ${message}`,
          progress: 0,
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          data: null,
          loading: false,
          error: message,
          currentStage: "error",
          pipelineLog: [...prev.pipelineLog, errStep],
        }));
      },
    });

    closeRef.current = close;
  }, []);

  const reset = useCallback(() => {
    closeRef.current?.();
    closeRef.current = null;

    setState({
      data: null,
      loading: false,
      error: null,
      progress: 0,
      currentStage: null,
      pipelineLog: [],
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
