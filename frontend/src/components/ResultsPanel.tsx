"use client";

import { useState } from "react";
import CommentsList from "./CommentsList";
import AISummaryCard from "./AISummaryCard";
import { IssueData } from "@/lib/api";

// ── Inline SVG icons (no lucide dependency needed) ────────────────────────────

const BackIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <path d="M15 3h6v6M10 14L21 3" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.962 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.582a.5.5 0 010 .962L15.5 14.063A2 2 0 0014.063 15.5l-1.582 6.135a.5.5 0 01-.962 0z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

// ── Component ──────────────────────────────────────────────────────────────────

interface ResultsPanelProps {
  data: IssueData;
  onNewSearch: () => void;
}

export default function ResultsPanel({ data, onNewSearch }: ResultsPanelProps) {
  const { issue, comments, summary, aiSummary } = data;
  const [descExpanded, setDescExpanded] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const hasLongDesc = (issue.body?.length ?? 0) > 500;
  const descText =
    !descExpanded && hasLongDesc
      ? issue.body?.slice(0, 500) + "…"
      : issue.body;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(data.url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch { /* noop */ }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

      {/* ── Top nav bar ── */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <button
          onClick={onNewSearch}
          className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content"
        >
          <BackIcon />
          New search
        </button>

        <div className="flex items-center gap-2">
          <div className="tooltip tooltip-bottom" data-tip={shareCopied ? "Link copied!" : "Copy link"}>
            <button
              onClick={handleShare}
              className={`btn btn-ghost btn-sm btn-square transition-colors ${
                shareCopied ? "text-success" : "text-base-content/50 hover:text-base-content"
              }`}
            >
              <ShareIcon />
            </button>
          </div>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm gap-1.5"
          >
            <ExternalLinkIcon />
            View on GitHub
          </a>
        </div>
      </div>

      {/* ── Issue hero header ── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge badge-primary badge-sm font-semibold">Issue</span>
          <span className="text-base-content/40 font-mono text-sm">#{issue.number}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content leading-tight tracking-tight mb-4">
          {issue.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-base-content/55">
          {issue.author && (
            <a
              href={`https://github.com/${issue.author.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <div className="avatar">
                <div className="w-5 rounded-full ring ring-base-300 ring-offset-1 ring-offset-base-100">
                  <img
                    src={`https://github.com/${issue.author.username}.png`}
                    alt={issue.author.displayName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(issue.author!.displayName)}&size=20&background=random`;
                    }}
                  />
                </div>
              </div>
              <span className="font-semibold text-base-content/75">{issue.author.displayName}</span>
            </a>
          )}
          {issue.postedAt && (
            <span className="flex items-center gap-1.5">
              <CalendarIcon />
              <time dateTime={issue.postedAt.datetime}>{issue.postedAt.label}</time>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MessageIcon />
            {summary.totalComments} comments
          </span>
          <span className="flex items-center gap-1.5">
            <UsersIcon />
            {summary.participants.length} participants
          </span>
        </div>
      </div>

      <div className="divider mt-0 mb-8" />

      {/* ── Two-column content grid ── */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* ── Left (main content) ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* AI Summary */}
          {aiSummary && (
            <section>
              <h2 className="flex items-center gap-2 text-xs font-bold text-base-content/50 uppercase tracking-widest mb-4">
                <SparklesIcon />
                AI Analysis
              </h2>
              <AISummaryCard aiSummary={aiSummary} />
            </section>
          )}

          {/* Issue Description */}
          <section>
            <h2 className="flex items-center gap-2 text-xs font-bold text-base-content/50 uppercase tracking-widest mb-4">
              <FileTextIcon />
              Description
            </h2>
            <div className="card card-border bg-base-200 shadow-sm">
              <div className="card-body p-5 gap-3">
                {issue.body ? (
                  <>
                    <p className="text-sm text-base-content/75 whitespace-pre-wrap break-words leading-relaxed">
                      {descText}
                    </p>
                    {hasLongDesc && (
                      <button
                        onClick={() => setDescExpanded((e) => !e)}
                        className="btn btn-ghost btn-xs gap-1.5 self-start text-primary font-semibold"
                      >
                        {descExpanded ? <><ChevronUpIcon /> Show less</> : <><ChevronDownIcon /> Read full description</>}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-base-content/40 italic">No description provided</p>
                )}
              </div>
            </div>
          </section>

          {/* Comments */}
          <section>
            <h2 className="flex items-center gap-2 text-xs font-bold text-base-content/50 uppercase tracking-widest mb-4">
              <MessageIcon />
              Conversation
              <span className="badge badge-ghost badge-sm ml-1 font-bold">{comments.length}</span>
            </h2>
            <CommentsList comments={comments} />
          </section>
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="stat bg-base-200 rounded-xl border border-base-300 shadow-sm p-4">
              <div className="stat-title text-xs uppercase tracking-widest">Comments</div>
              <div className="stat-value text-3xl">{summary.totalComments}</div>
            </div>
            <div className="stat bg-base-200 rounded-xl border border-base-300 shadow-sm p-4">
              <div className="stat-title text-xs uppercase tracking-widest">Participants</div>
              <div className="stat-value text-3xl">{summary.participants.length}</div>
            </div>
          </div>

          {/* Participants */}
          {summary.participants.length > 0 && (
            <div className="card card-border bg-base-200 shadow-sm">
              <div className="card-body p-0">
                <div className="px-4 pt-4 pb-2 text-xs font-bold text-base-content/50 uppercase tracking-widest flex items-center gap-2">
                  <UsersIcon />
                  Active Participants
                </div>
                <div className="divider my-0" />
                <ul className="menu menu-sm px-2 pb-2 gap-0.5">
                  {summary.participants.slice(0, 10).map((username) => (
                    <li key={username}>
                      <a
                        href={`https://github.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-lg"
                      >
                        <div className="avatar">
                          <div className="w-6 rounded-full ring ring-base-300 ring-offset-1 ring-offset-base-100">
                            <img
                              src={`https://github.com/${username}.png`}
                              alt={username}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                        <span className="truncate text-sm font-medium">{username}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                {summary.participants.length > 10 && (
                  <p className="px-4 pb-3 text-xs text-base-content/40 font-medium">
                    +{summary.participants.length - 10} more participants
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Extraction metadata */}
          <div className="card card-border bg-base-200 shadow-sm">
            <div className="card-body p-4 gap-3">
              <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-widest">
                Metadata
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/50">Issue type</span>
                  <span className="badge badge-ghost badge-sm font-semibold capitalize">
                    {issue.type || "issue"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/50">AI model</span>
                  <span className="badge badge-primary badge-sm badge-outline font-semibold">
                    T5-small
                  </span>
                </div>
                {data.extractedAt && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-base-content/50 shrink-0">Extracted</span>
                    <time className="font-mono text-base-content/60 text-right tabular-nums">
                      {new Date(data.extractedAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </time>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
