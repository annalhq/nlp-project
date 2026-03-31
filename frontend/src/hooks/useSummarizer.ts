"use client";

import { useState } from "react";
import { summarizeIssue, IssueData } from "@/lib/api";

export interface UseSummarizerState {
  data: IssueData | null;
  loading: boolean;
  error: string | null;
}

export function useSummarizer() {
  const [state, setState] = useState<UseSummarizerState>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (url: string) => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await summarizeIssue(url);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setState({ data: null, loading: false, error: errorMessage });
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  return {
    ...state,
    execute,
    reset,
  };
}
