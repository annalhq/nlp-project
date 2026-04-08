"use client";

import { useState } from "react";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import ResultsPanel from "@/components/ResultsPanel";
import PipelineProgress from "@/components/PipelineProgress";
import ErrorState from "@/components/ErrorState";
import { useSummarizer } from "@/hooks/useSummarizer";

export default function Home() {
  const {
    data,
    error,
    loading,
    progress,
    currentStage,
    pipelineLog,
    execute,
    reset,
  } = useSummarizer();

  const handleSubmit = (url: string) => {
    execute(url);
  };

  const handleNewSearch = () => {
    reset();
  };

  // Determine what to render
  const showInput = !data && !loading && !error;
  const showPipeline = loading || (currentStage === "complete" && !data);
  const showResults = !!data && !loading;
  const showError = !!error && !loading;

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── Input / Hero state ── */}
        {showInput && (
          <div className="py-10 sm:py-16">
            <div className="max-w-xl mx-auto px-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl sm:text-5xl font-bold mb-3 leading-tight">
                  Turn GitHub Issues into Clear Insights
                </h2>
                <p className="text-base text-base-content/60 max-w-md mx-auto">
                  Extract issue threads, view all comments, and understand
                  discussions at a glance
                </p>
              </div>
              <InputForm onSubmit={handleSubmit} isLoading={loading} />
            </div>
          </div>
        )}

        {/* ── Live SSE pipeline progress ── */}
        {showPipeline && (
          <PipelineProgress
            currentStage={currentStage}
            progress={progress}
            pipelineLog={pipelineLog}
            isError={false}
          />
        )}

        {/* ── Error state ── */}
        {showError && (
          <ErrorState
            error={error}
            pipelineLog={pipelineLog}
            onRetry={() => reset()}
          />
        )}

        {/* ── Results ── */}
        {showResults && (
          <ResultsPanel data={data} onNewSearch={handleNewSearch} />
        )}
      </main>
    </div>
  );
}
