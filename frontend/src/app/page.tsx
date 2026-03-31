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
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
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
          <div className="py-5  sm:py-10">
            <div className="max-w-xl mx-auto px-6">
              {/* Hero Section */}
              <div className="text-center mb-8">
                <h2 className="text-4xl sm:text-5xl font-bold mb-3 leading-tight">
                  Turn GitHub Issues into Clear Insights
                </h2>
                <p className="text-base text-base-content/60 max-w-md mx-auto">
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
