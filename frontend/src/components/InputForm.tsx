"use client";

import { useState } from "react";

interface InputFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export default function InputForm({
  onSubmit,
  isLoading = false,
}: InputFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const isValidGithubUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return /^https:\/\/github\.com\/.+\/issues\/\d+/.test(urlObj.toString());
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a GitHub issue URL");
      return;
    }

    if (!isValidGithubUrl(url)) {
      setError(
        "Invalid GitHub issue URL. Expected format: https://github.com/owner/repo/issues/123",
      );
      return;
    }

    onSubmit(url);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto px-4 sm:px-6"
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="issue-url"
            className="block text-sm font-medium mb-3 text-[var(--foreground)]"
          >
            GitHub Issue URL
          </label>
          <input
            id="issue-url"
            type="text"
            placeholder="https://github.com/owner/repo/issues/123"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg 
              bg-[var(--background)] text-[var(--foreground)]
              placeholder:text-[var(--text-tertiary)]
              focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          />
        </div>

        {error && (
          <div
            className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 
            border border-red-200 dark:border-red-900/40 rounded-lg p-4 flex gap-3"
          >
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] 
            text-white font-medium rounded-lg transition-colors duration-200
            disabled:opacity-70 disabled:cursor-not-allowed
            active:scale-[0.98] transform"
        >
          {isLoading ? "Processing..." : "Analyze Issue"}
        </button>
      </div>
    </form>
  );
}
