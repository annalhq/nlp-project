"use client";

import { PipelineStep } from "@/hooks/useSummarizer";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  pipelineLog?: PipelineStep[];
}

const RetryIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 12a9 9 0 109-9M3 3v5h5" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const TIPS = [
  "Verify the GitHub issue URL is correct and publicly accessible",
  "The scraper service must be running on port 5000",
  "Try refreshing and pasting the URL again",
];

export default function ErrorState({ error, onRetry, pipelineLog = [] }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 py-12">
      <div className="w-full max-w-lg space-y-5">

        {/* ── Error card ── */}
        <div className="card bg-base-200 border border-error/20 shadow-sm overflow-hidden">
          {/* Top accent stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-error/80 via-error/40 to-transparent" />

          <div className="card-body p-6 gap-4">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-base-content leading-tight">
                  Failed to analyze issue
                </h2>
                <p className="text-sm text-base-content/55 mt-1 leading-relaxed break-words">
                  {error}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="divider my-0" />

            {/* Tips */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">
                Things to check
              </p>
              <ul className="space-y-1.5">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-base-content/60">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-base-content/30 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              {onRetry && (
                <>
                  <button
                    onClick={onRetry}
                    className="btn btn-sm btn-ghost gap-2 text-base-content/50 hover:text-base-content"
                  >
                    <ArrowLeftIcon />
                    Back
                  </button>
                  <button
                    onClick={onRetry}
                    className="btn btn-sm btn-primary gap-2 flex-1"
                  >
                    <RetryIcon />
                    Try Again
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Pipeline log (if any) ── */}
        {pipelineLog.length > 0 && (
          <div className="rounded-xl border border-base-300 overflow-hidden shadow-inner bg-base-300/40">
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-base-300/60 border-b border-base-300">
              <span className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-error/70" />
                <span className="w-3 h-3 rounded-full bg-warning/70" />
                <span className="w-3 h-3 rounded-full bg-success/70" />
              </span>
              <span className="text-xs font-semibold text-base-content/50 font-mono ml-1">
                pipeline.log
              </span>
              <span className="ml-auto text-[10px] font-bold text-base-content/35 uppercase tracking-wider">
                {pipelineLog.length} event{pipelineLog.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-y-auto max-h-40 px-4 py-3 space-y-1 font-mono">
              {pipelineLog.map((entry, i) => {
                const tagColor =
                  entry.stage === "error"
                    ? "text-error bg-error/15"
                    : entry.stage === "complete"
                    ? "text-success bg-success/15"
                    : "text-base-content/50 bg-base-300";
                return (
                  <div key={i} className="flex items-start gap-2 text-xs opacity-80">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${tagColor}`}>
                      {entry.stage}
                    </span>
                    <span className={entry.stage === "error" ? "text-error" : "text-base-content/65"}>
                      {entry.message}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
