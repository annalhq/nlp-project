"use client";

import { useState } from "react";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import ResultsPanel from "@/components/ResultsPanel";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { useSummarizer } from "@/hooks/useSummarizer";

type ViewState = "input" | "loading" | "results" | "error";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("input");
  const { data, error, loading, execute, reset } = useSummarizer();

  const handleSubmit = async (url: string) => {
    setViewState("loading");
    await execute(url);
  };

  const handleNewSearch = () => {
    reset();
    setViewState("input");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <Header />

      <main className="flex-1">
        {loading && <LoadingState />}

        {error && !loading && (
          <ErrorState
            error={error}
            onRetry={() => {
              reset();
              setViewState("input");
            }}
          />
        )}

        {data && !loading && !error && (
          <ResultsPanel data={data} onNewSearch={handleNewSearch} />
        )}

        {!data && !loading && !error && (
          <div className="py-20 sm:py-32">
            <div className="max-w-2xl mx-auto px-6">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                  Analyze GitHub Issues
                </h2>
                <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto">
                  Extract issue threads, view all comments, and understand
                  discussions at a glance
                </p>
              </div>

              {/* Input Form */}
              <InputForm onSubmit={handleSubmit} isLoading={loading} />

            </div>
          </div>
        )}
      </main>

    </div>
  );
}
