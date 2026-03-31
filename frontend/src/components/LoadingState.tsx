"use client";

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="mb-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-[var(--accent)] rounded-full opacity-10 animate-ping"></div>
          <div className="absolute inset-2 bg-[var(--accent)] rounded-full"></div>
          <svg
            className="absolute inset-0 w-12 h-12 text-[var(--accent)] animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            ></circle>
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">
        Analyzing issue...
      </h3>
      <p className="text-[var(--text-secondary)] text-center max-w-md">
        Fetching and processing the GitHub issue thread. This may take a moment.
      </p>
    </div>
  );
}
