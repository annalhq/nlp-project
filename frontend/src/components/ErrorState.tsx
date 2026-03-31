"use client";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
              Failed to analyze issue
            </h3>
            <p className="text-red-700 dark:text-red-400 text-sm mb-4">
              {error}
            </p>
            <ul className="text-sm text-red-600 dark:text-red-400 space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-red-600 dark:bg-red-400 rounded-full"></span>
                Verify the GitHub issue URL is correct
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-red-600 dark:bg-red-400 rounded-full"></span>
                Ensure the issue is publicly accessible
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-red-600 dark:bg-red-400 rounded-full"></span>
                Check your internet connection
              </li>
            </ul>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 
                  text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 
                  transition-colors font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7 7 0 0111.601 2.566 1 1 0 11-1.885.666A5 5 0 005.89 4.101V3a1 1 0 01-1-1zm12 12a1 1 0 01-1 1h-2.101a7 7 0 01-11.601-2.566 1 1 0 11 1.885-.666A5 5 0 0014.11 15.9H16a1 1 0 011 1z"
                    clipRule="evenodd"
                  />
                </svg>
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
