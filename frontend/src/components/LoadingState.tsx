"use client";

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 gap-4">
      <span className="loading loading-ring loading-lg text-neutral"></span>
      <div className="text-center">
        <p className="font-semibold text-base-content">Analyzing issue...</p>
        <p className="text-sm text-base-content/60 mt-1 max-w-sm">
          Fetching and processing the GitHub issue thread. This may take a
          moment.
        </p>
      </div>
    </div>
  );
}
