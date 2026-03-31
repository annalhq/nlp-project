"use client";

import CommentsList from "./CommentsList";
import { IssueData } from "@/lib/api";

interface ResultsPanelProps {
  data: IssueData;
  onNewSearch: () => void;
}

export default function ResultsPanel({ data, onNewSearch }: ResultsPanelProps) {
  const { issue, comments, summary } = data;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      {/* Navigation */}
      <div className="mb-10 flex items-center justify-between">
        <button
          onClick={onNewSearch}
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] 
            font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] 
            border border-[var(--border)] rounded-lg hover:bg-[var(--surface-secondary)]
            transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h3.586L9.293 9.293a1 1 0 000 1.414 1 1 0 001.414 0L16 6.414V10a1 1 0 102 0V4a1 1 0 00-1-1h-6z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          View on GitHub
        </a>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Section - Issue Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-2.5 py-1 bg-[var(--accent)] text-white rounded text-xs font-semibold tracking-tight">
                Issue
              </span>
              <span className="text-[var(--text-tertiary)] font-mono text-sm">
                #{issue.number}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-5 leading-tight">
              {issue.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              {issue.author && (
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-secondary)]">
                    Opened by
                  </span>
                  <a
                    href={`https://github.com/${issue.author.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                  >
                    {issue.author.displayName}
                  </a>
                </div>
              )}
              {issue.postedAt && (
                <div className="text-[var(--text-tertiary)]">
                  <time
                    dateTime={issue.postedAt.datetime}
                    title={issue.postedAt.label}
                  >
                    {issue.postedAt.label}
                  </time>
                </div>
              )}
            </div>
          </div>

          {/* Issue Description */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
              Description
            </h3>
            <div className="text-[var(--text-secondary)] whitespace-pre-wrap break-words leading-relaxed">
              {issue.body || "_No description provided_"}
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
              Conversation ({comments.length})
            </h3>
            <CommentsList comments={comments} />
          </div>
        </div>

        {/* Right Sidebar - Stats & Participants */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="space-y-3">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                Comments
              </div>
              <div className="text-3xl font-bold text-[var(--foreground)]">
                {summary.totalComments}
              </div>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                Participants
              </div>
              <div className="text-3xl font-bold text-[var(--foreground)]">
                {summary.participants.length}
              </div>
            </div>
          </div>

          {/* Participants */}
          {summary.participants.length > 0 && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
                Active Participants
              </h3>
              <div className="space-y-2">
                {summary.participants.slice(0, 8).map((username) => (
                  <a
                    key={username}
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--background)] transition-colors text-sm truncate"
                  >
                    <img
                      src={`https://github.com/${username}.png`}
                      alt={username}
                      className="w-6 h-6 rounded-full flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="text-[var(--foreground)] truncate hover:text-[var(--accent)]">
                      {username}
                    </span>
                  </a>
                ))}
                {summary.participants.length > 8 && (
                  <div className="text-xs text-[var(--text-tertiary)] pt-2 px-3">
                    +{summary.participants.length - 8} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
