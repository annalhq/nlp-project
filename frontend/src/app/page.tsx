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

              {/* Examples Section */}
              <div className="mt-16 pt-16 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
                  Try with these examples:
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    {
                      url: "https://github.com/nodejs/node/issues/12345",
                      label: "Node.js",
                      icon: "⚙️",
                    },
                    {
                      url: "https://github.com/vercel/next.js/issues/43210",
                      label: "Next.js",
                      icon: "⚡",
                    },
                    {
                      url: "https://github.com/facebook/react/issues/25000",
                      label: "React",
                      icon: "⚛️",
                    },
                  ].map(({ url, label, icon }) => (
                    <button
                      key={label}
                      onClick={() => {
                        const input = document.getElementById(
                          "issue-url",
                        ) as HTMLInputElement;
                        if (input) {
                          input.value = url;
                        }
                      }}
                      className="group px-4 py-3 text-sm border border-[var(--border)] rounded-lg 
                        hover:border-[var(--text-secondary)] hover:bg-[var(--surface)]
                        transition-colors text-left"
                    >
                      <div className="font-medium text-[var(--foreground)] mb-1 flex items-center gap-2">
                        <span>{icon}</span>
                        {label}
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)] truncate">
                        Example issue
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-[var(--text-secondary)]">
          Built with <span className="text-red-500">♥</span> to analyze GitHub
          discussions
        </div>
      </footer>
    </div>
  );
}
