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
          className="btn btn-ghost btn-sm gap-2"
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
          className="btn btn-outline btn-sm gap-2"
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
              <span className="badge badge-primary badge-sm font-semibold tracking-tight">
                Issue
              </span>
              <span className="text-base-content/40 font-mono text-sm">
                #{issue.number}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-base-content mb-5 leading-tight">
              {issue.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              {issue.author && (
                <div className="flex items-center gap-2">
                  <span className="text-base-content/60">Opened by</span>
                  <a
                    href={`https://github.com/${issue.author.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-base-content hover:text-primary transition-colors"
                  >
                    {issue.author.displayName}
                  </a>
                </div>
              )}
              {issue.postedAt && (
                <div className="text-base-content/40">
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
          <div className="card card-border bg-base-200 shadow-sm">
            <div className="card-body gap-3">
              <h3 className="card-title text-xs font-semibold text-base-content/50 uppercase tracking-widest">
                Description
              </h3>
              <p className="text-base-content/70 whitespace-pre-wrap break-words leading-relaxed">
                {issue.body || "_No description provided_"}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-widest mb-4">
              Conversation ({comments.length})
            </h3>
            <CommentsList comments={comments} />
          </div>
        </div>

        {/* Right Sidebar - Stats & Participants */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="stat bg-base-200 rounded-box shadow-sm p-4">
              <div className="stat-title text-xs uppercase tracking-widest">
                Comments
              </div>
              <div className="stat-value text-3xl">{summary.totalComments}</div>
            </div>
            <div className="stat bg-base-200 rounded-box shadow-sm p-4">
              <div className="stat-title text-xs uppercase tracking-widest">
                Participants
              </div>
              <div className="stat-value text-3xl">
                {summary.participants.length}
              </div>
            </div>
          </div>

          {/* Participants */}
          {summary.participants.length > 0 && (
            <div className="card card-border bg-base-200 shadow-sm">
              <div className="card-body gap-3 p-4">
                <h3 className="card-title text-xs font-semibold text-base-content/50 uppercase tracking-widest">
                  Active Participants
                </h3>
                <ul className="menu menu-sm p-0 gap-0.5">
                  {summary.participants.slice(0, 8).map((username) => (
                    <li key={username}>
                      <a
                        href={`https://github.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 truncate"
                      >
                        <div className="avatar">
                          <div className="w-6 rounded-full">
                            <img
                              src={`https://github.com/${username}.png`}
                              alt={username}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        </div>
                        <span className="truncate">{username}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                {summary.participants.length > 8 && (
                  <p className="text-xs text-base-content/40 px-2 pt-1">
                    +{summary.participants.length - 8} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
