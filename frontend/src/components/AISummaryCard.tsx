"use client";

import { useState } from "react";
import { AiSummary } from "@/lib/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readingTime(text: string) {
  const words = wordCount(text);
  const minutes = Math.ceil(words / 200);
  return minutes <= 1 ? "< 1 min" : `~${minutes} min`;
}

function splitLeadSentence(text: string): [string, string] {
  const match = text.match(/^(.+?[.!?])\s+([\s\S]*)$/);
  if (match) return [match[1], match[2]];
  return [text, ""];
}

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ text, accent }: { text: string; accent: "primary" | "success" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  const base = accent === "primary" ? "text-primary hover:bg-primary/10" : "text-emerald-700 dark:text-emerald-600 hover:bg-emerald-500/10";

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className={`btn btn-ghost btn-xs gap-1.5 font-semibold transition-all ${base}`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// ── Stat chip ─────────────────────────────────────────────────────────────────

function StatChip({ icon, label, accent }: { icon: React.ReactNode; label: string; accent: string }) {
  const chipClasses = accent === "primary"
    ? "bg-primary/10 text-primary"
    : "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-600";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${chipClasses}`}>
      {icon}
      {label}
    </span>
  );
}

// ── Text body ─────────────────────────────────────────────────────────────────

const COLLAPSE_CHARS = 350;

interface TextBodyProps {
  text: string;
  accent: "primary" | "success";
}

function TextBody({ text, accent }: TextBodyProps) {
  const [expanded, setExpanded] = useState(false);
  const [lead, rest] = splitLeadSentence(text);
  const isLong = text.length > COLLAPSE_CHARS;
  const showRest = !isLong || expanded;

  const wc = wordCount(text);
  const rt = readingTime(text);

  const btnColor    = accent === "primary" ? "text-primary" : "text-emerald-700 dark:text-emerald-600";
  const accentBg    = accent === "primary" ? "bg-primary/10"  : "bg-emerald-500/10";
  const accentBdr   = accent === "primary" ? "border-primary/30" : "border-emerald-500/40";
  const accentHover = accent === "primary" ? "hover:bg-primary/10" : "hover:bg-emerald-500/10";

  const wordIcon = (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M5 8h14" />
    </svg>
  );
  const timeIcon = (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="space-y-4">
      {/* Stat chips */}
      <div className="flex flex-wrap gap-2">
        <StatChip icon={wordIcon} label={`${wc} words`} accent={accent} />
        <StatChip icon={timeIcon} label={`${rt} read`} accent={accent} />
      </div>

      {/* Lead sentence — highlighted block */}
      {lead && (
        <blockquote className={`border-l-4 ${accentBdr} ${accentBg} rounded-r-lg px-4 py-3`}>
          <p className="text-sm font-bold leading-relaxed text-base-content/90">
            {lead}
          </p>
        </blockquote>
      )}

      {/* Remaining body */}
      {rest && showRest && (
        <p className="text-sm font-medium leading-relaxed text-base-content/80 whitespace-pre-wrap">
          {rest}
        </p>
      )}

      {/* Expand / collapse */}
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className={`btn btn-ghost btn-xs font-semibold gap-1.5 ${btnColor} ${accentHover}`}
        >
          {expanded ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
              Show less
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Read full summary
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Tab = "issue" | "solutions";

const TABS: { key: Tab; label: string; accent: "primary" | "success"; desc: string }[] = [
  { key: "issue",     label: "Issue Summary", accent: "primary", desc: "AI overview of the problem" },
  { key: "solutions", label: "Solutions",     accent: "success", desc: "Proposed fixes from comments" },
];

interface AISummaryCardProps {
  aiSummary: AiSummary;
}

export default function AISummaryCard({ aiSummary }: AISummaryCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("issue");

  const active = TABS.find((t) => t.key === activeTab)!;
  const activeText =
    activeTab === "issue"
      ? aiSummary.issueSummary
      : aiSummary.commentsSolutionSummary;

  const accentGradient =
    activeTab === "issue"
      ? "from-primary/10 via-primary/5 to-transparent"
      : "from-emerald-500/15 via-emerald-500/5 to-transparent";

  const accentBorder =
    activeTab === "issue" ? "border-primary/25" : "border-emerald-500/30";

  const accentText = activeTab === "issue" ? "text-primary" : "text-emerald-700 dark:text-emerald-600";
  const accentBadgeBg = activeTab === "issue" ? "bg-primary/15" : "bg-emerald-500/15";

  return (
    <div className={`rounded-2xl border ${accentBorder} overflow-hidden shadow-lg bg-base-200 transition-all duration-500`}>

      {/* ── Gradient banner header ─────────────────── */}
      <div className={`bg-gradient-to-r ${accentGradient} px-5 pt-5 pb-4 border-b border-base-300`}>
        <div className="flex items-start justify-between gap-3">
          {/* Left: icon + title */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${accentBadgeBg} ${accentText} flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300`}>
              {activeTab === "issue" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-base font-bold text-base-content leading-tight">
                {active.label}
              </p>
              <p className="text-xs font-medium text-base-content/60 mt-0.5">
                {active.desc}
              </p>
            </div>
          </div>

          {/* Right: model badge + copy */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-base-300 text-base-content/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              T5-small
            </span>
            <CopyButton text={activeText} accent={active.accent} />
          </div>
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex gap-1.5 mt-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const tabAccentText  = tab.accent === "primary" ? "text-primary"  : "text-emerald-700 dark:text-emerald-600";
            const tabAccentBg    = tab.accent === "primary" ? "bg-primary/15" : "bg-emerald-500/15";
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? `${tabAccentBg} ${tabAccentText} shadow-sm`
                    : "text-base-content/50 hover:text-base-content hover:bg-base-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────── */}
      <div className="px-5 py-5">
        <TextBody key={activeTab} text={activeText} accent={active.accent} />
      </div>


    </div>
  );
}
