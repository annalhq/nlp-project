"use client";

import { AiSummary } from "@/lib/api";

interface AISummaryCardProps {
  aiSummary: AiSummary;
}

export default function AISummaryCard({ aiSummary }: AISummaryCardProps) {
  return (
    <div className="space-y-5">
      {/* Issue Summary */}
      <div className="card bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 shadow-md border border-primary/20">
        <div className="card-body gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-base-content">
                Issue Summary
              </h3>
              <p className="text-xs text-base-content/50">
                AI-generated overview of the issue
              </p>
            </div>
            <span className="badge badge-primary badge-sm ml-auto gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-content opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-content"></span>
              </span>
              T5
            </span>
          </div>
          <p className="text-base-content/75 leading-relaxed text-sm">
            {aiSummary.issueSummary}
          </p>
        </div>
      </div>

      {/* Comments Solutions Summary */}
      <div className="card bg-gradient-to-br from-success/10 via-base-200 to-info/10 shadow-md border border-success/20">
        <div className="card-body gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success/15 text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-base-content">
                Potential Solutions
              </h3>
              <p className="text-xs text-base-content/50">
                Key solutions extracted from comments
              </p>
            </div>
            <span className="badge badge-success badge-sm ml-auto gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-content opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success-content"></span>
              </span>
              T5
            </span>
          </div>
          <p className="text-base-content/75 leading-relaxed text-sm">
            {aiSummary.commentsSolutionSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
