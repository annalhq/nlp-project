"use client";

import { useEffect, useRef } from "react";
import { PipelineStep, PipelineStage } from "@/hooks/useSummarizer";

// ── Stage config ──────────────────────────────────────────────────────────────

interface StageConfig {
  key: PipelineStage;
  label: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const STAGES: StageConfig[] = [
  {
    key: "init",
    label: "Initialise",
    description: "Validating URL and preparing pipeline",
    color: "primary",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: "scraping",
    label: "Scraping",
    description: "Launching browser & fetching GitHub page",
    color: "warning",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
  },
  {
    key: "extracting",
    label: "Extracting",
    description: "Parsing issue body, comments & metadata",
    color: "info",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: "summarizing",
    label: "Summarizing",
    description: "T5 model generating AI summaries",
    color: "secondary",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

type StepStatus = "pending" | "active" | "done" | "error";

function getStageOrder(stage: PipelineStage): number {
  const order: Record<PipelineStage, number> = {
    init: 0, scraping: 1, extracting: 2, summarizing: 3, complete: 4, error: -1,
  };
  return order[stage] ?? -1;
}

function getStepStatus(
  stageKey: PipelineStage,
  currentStage: PipelineStage | null,
  isError: boolean,
): StepStatus {
  if (isError) {
    const errPos = getStageOrder(currentStage ?? "error");
    const thisPos = getStageOrder(stageKey);
    if (thisPos < errPos) return "done";
    if (thisPos === errPos) return "error";
    return "pending";
  }
  const current = getStageOrder(currentStage ?? "init");
  const thisPos = getStageOrder(stageKey);
  if (currentStage === "complete") return "done";
  if (thisPos < current) return "done";
  if (thisPos === current) return "active";
  return "pending";
}

// colour map for the stage badge backgrounds / rings
const COLOR_MAP: Record<string, { bg: string; ring: string; text: string; line: string }> = {
  primary:   { bg: "bg-primary/20",   ring: "ring-primary/50",   text: "text-primary",   line: "bg-primary/35" },
  warning:   { bg: "bg-warning/20",   ring: "ring-warning/50",   text: "text-warning",   line: "bg-warning/35" },
  info:      { bg: "bg-info/20",      ring: "ring-info/50",      text: "text-info",      line: "bg-info/35" },
  secondary: { bg: "bg-secondary/20", ring: "ring-secondary/50", text: "text-secondary", line: "bg-secondary/35" },
};

// ── Step badge ────────────────────────────────────────────────────────────────

function StepBadge({
  status,
  color,
  icon,
}: {
  status: StepStatus;
  color: string;
  icon: React.ReactNode;
}) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.primary;

  if (status === "done")
    return (
      <span className={`w-9 h-9 rounded-xl ${c.bg} ${c.text} flex items-center justify-center shrink-0 shadow-sm`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );

  if (status === "active")
    return (
      <span className={`w-9 h-9 rounded-xl ${c.bg} ${c.text} flex items-center justify-center shrink-0 ring-2 ${c.ring} shadow-md`}>
        <span className="loading loading-spinner loading-xs" />
      </span>
    );

  if (status === "error")
    return (
      <span className="w-9 h-9 rounded-xl bg-error/20 text-error flex items-center justify-center shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );

  // pending
  return (
    <span className="w-9 h-9 rounded-xl bg-base-300 text-base-content/30 flex items-center justify-center shrink-0">
      {icon}
    </span>
  );
}

// ── Log entry ─────────────────────────────────────────────────────────────────

function LogEntry({ entry, isLatest }: { entry: PipelineStep; index: number; isLatest: boolean }) {
  const tagColor =
    entry.stage === "error"   ? "text-error bg-error/15"
    : entry.stage === "complete" ? "text-success bg-success/15"
    : entry.stage === "summarizing" ? "text-secondary bg-secondary/15"
    : entry.stage === "extracting"  ? "text-info bg-info/15"
    : entry.stage === "scraping"    ? "text-warning bg-warning/15"
    : "text-primary bg-primary/15";

  const msgColor =
    entry.stage === "error"   ? "text-error"
    : entry.stage === "complete" ? "text-success font-semibold"
    : isLatest ? "text-base-content font-medium"
    : "text-base-content/75";

  return (
    <div className={`flex items-start gap-2.5 py-0.5 transition-all duration-200 ${isLatest ? "opacity-100" : "opacity-70"}`}>
      {/* Stage tag pill */}
      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 ${tagColor}`}>
        {entry.stage}
      </span>
      {/* Message */}
      <span className={`text-xs leading-relaxed ${msgColor}`}>
        {entry.message}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface PipelineProgressProps {
  currentStage: PipelineStage | null;
  progress: number;
  pipelineLog: PipelineStep[];
  isError?: boolean;
  errorMessage?: string | null;
}

export default function PipelineProgress({
  currentStage,
  progress,
  pipelineLog,
  isError = false,
  errorMessage = null,
}: PipelineProgressProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pipelineLog]);

  const clampedProgress = Math.min(100, Math.max(0, progress));
  const isDone = currentStage === "complete";

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 py-10">
      <div className="w-full max-w-lg space-y-7">

        {/* ── Header ─────────────────────────────────── */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-base-content">
            {isError
              ? "Pipeline failed"
              : isDone
              ? "Analysis complete!"
              : "Analyzing issue…"}
          </h2>
          <p className="text-sm font-medium text-base-content/65">
            {isError
              ? errorMessage ?? "An unexpected error occurred."
              : isDone
              ? "All pipeline stages finished successfully."
              : "Live pipeline — watch each stage as it runs"}
          </p>
        </div>

        {/* ── Progress bar ────────────────────────────── */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-widest">
              Progress
            </span>
            <span className="text-sm font-bold tabular-nums text-base-content">
              {clampedProgress}%
            </span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isError ? "bg-error" : isDone ? "bg-success" : "bg-primary"
              }`}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>

        {/* ── Stage timeline ──────────────────────────── */}
        <div className="card bg-base-200 border border-base-300 shadow-sm">
          <div className="card-body p-5 gap-0">
            {STAGES.map((stage, idx) => {
              const status = getStepStatus(stage.key, currentStage, isError);
              const isLast = idx === STAGES.length - 1;
              const c = COLOR_MAP[stage.color] ?? COLOR_MAP.primary;
              const latestMsg = pipelineLog.filter((l) => l.stage === stage.key).at(-1)?.message;

              return (
                <div key={stage.key} className="flex items-start gap-4">
                  {/* Badge + connector line */}
                  <div className="flex flex-col items-center pt-0.5">
                    <StepBadge status={status} color={stage.color} icon={stage.icon} />
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 mt-1.5 mb-1.5 min-h-8 rounded-full transition-all duration-700 ${
                          status === "done" ? c.line : "bg-base-300"
                        }`}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className={`${isLast ? "pb-0" : "pb-5"} pt-0.5 min-w-0 flex-1`}>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-bold tracking-tight transition-colors duration-300 ${
                          status === "active"
                            ? c.text
                            : status === "done"
                            ? "text-base-content"
                            : status === "error"
                            ? "text-error"
                            : "text-base-content/40"
                        }`}
                      >
                        {stage.label}
                      </p>
                      {status === "done" && (
                        <span className="badge badge-xs badge-ghost text-base-content/50 font-medium">done</span>
                      )}
                    </div>

                    {/* Static hint when pending/done */}
                    {(status === "pending" || status === "done") && (
                      <p className={`text-xs mt-0.5 font-medium ${status === "done" ? "text-base-content/55" : "text-base-content/35"}`}>
                        {stage.description}
                      </p>
                    )}

                    {/* Live message when active */}
                    {status === "active" && (
                      <p className={`text-xs mt-0.5 font-semibold ${c.text} animate-pulse`}>
                        {latestMsg ?? "Processing…"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Live log terminal ───────────────────────── */}
        {pipelineLog.length > 0 && (
          <div className="rounded-xl border border-base-300 overflow-hidden shadow-inner bg-base-300/40">
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-base-300/60 border-b border-base-300">
              <span className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-error/70" />
                <span className="w-3 h-3 rounded-full bg-warning/70" />
                <span className="w-3 h-3 rounded-full bg-success/70" />
              </span>
              <span className="text-xs font-semibold text-base-content/55 font-mono ml-1 tracking-wide">
                pipeline.log
              </span>
              <span className="ml-auto text-[10px] font-bold text-base-content/35 uppercase tracking-wider">
                {pipelineLog.length} event{pipelineLog.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Entries */}
            <div className="overflow-y-auto max-h-48 px-4 py-3 space-y-1 font-mono">
              {pipelineLog.map((entry, i) => (
                <LogEntry
                  key={i}
                  entry={entry}
                  index={i}
                  isLatest={i === pipelineLog.length - 1}
                />
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
