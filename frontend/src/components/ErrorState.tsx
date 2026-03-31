"use client";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div role="alert" className="alert alert-error alert-soft">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold">Failed to analyze issue</h3>
          <p className="text-sm mt-0.5 opacity-80">{error}</p>
          <ul className="text-sm mt-3 space-y-1 opacity-80 list-disc list-inside">
            <li>Verify the GitHub issue URL is correct</li>
            <li>Ensure the issue is publicly accessible</li>
            <li>Check your internet connection</li>
          </ul>
        </div>
      </div>

      {onRetry && (
        <div className="mt-4 flex justify-center">
          <button onClick={onRetry} className="btn btn-sm btn-neutral gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
