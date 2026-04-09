"use client";

import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import ResultsPanel from "@/components/ResultsPanel";
import PipelineProgress from "@/components/PipelineProgress";
import ErrorState from "@/components/ErrorState";
import { useSummarizer } from "@/hooks/useSummarizer";


function Footer() {
  return (
    <footer className="border-t border-base-200 py-5 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-content/35">
        <span className="font-semibold tracking-tight">
          GitBrief · GitHub Issue Analyzer
        </span>
        <span className="font-medium">
          Powered by <span className="text-base-content/50 font-semibold">T5-small</span> · Open source NLP
        </span>
      </div>
    </footer>
  );
}

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

  const showInput    = !data && !loading && !error;
  const showPipeline = loading || (currentStage === "complete" && !data);
  const showResults  = !!data && !loading;
  const showError    = !!error && !loading;

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">

        {/* ── Hero / Input ── */}
        {showInput && (
          <div className="flex-1 flex flex-col items-center justify-center px-5 py-20 sm:py-28 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-secondary/4 blur-3xl" />
            </div>

            <div className="hero-enter relative w-full max-w-lg flex flex-col items-center text-center gap-8">

              {/* ── Headline ── */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-[3.25rem] font-extrabold text-base-content leading-[1.08] tracking-tight">
                  Understand GitHub{" "}
                  <span className="text-primary">Issues</span>{" "}
                  at a glance
                </h1>
                <p className="text-[15px] text-base-content/50 max-w-[360px] mx-auto leading-relaxed">
                  Paste any GitHub issue URL, GitBrief scrapes the full thread
                  and delivers an AI-powered summary in seconds.
                </p>
              </div>

              {/* ── Input form ── */}
              <div className="w-full">
                <InputForm onSubmit={(url) => execute(url)} isLoading={loading} />
              </div>

              {/* ── Example links ── */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-base-content/35">
                <span className="font-semibold">Try an example:</span>
                {[
                  { repo: "vercel/next.js", num: "65396" },
                  { repo: "microsoft/vscode", num: "192654" },
                ].map(({ repo, num }) => (
                  <button
                    key={num}
                    onClick={() => execute(`https://github.com/${repo}/issues/${num}`)}
                    className="font-mono hover:text-primary transition-colors underline underline-offset-2"
                  >
                    {repo}#{num}
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ── Pipeline progress ── */}
        {showPipeline && (
          <PipelineProgress
            currentStage={currentStage}
            progress={progress}
            pipelineLog={pipelineLog}
            isError={false}
          />
        )}

        {/* ── Error ── */}
        {showError && (
          <ErrorState
            error={error}
            pipelineLog={pipelineLog}
            onRetry={() => reset()}
          />
        )}

        {/* ── Results ── */}
        {showResults && (
          <ResultsPanel data={data} onNewSearch={() => reset()} />
        )}
      </main>

      {/* Show footer only on the landing page */}
      {showInput && <Footer />}
    </div>
  );
}
