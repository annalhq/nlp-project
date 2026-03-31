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
  const [pasted, setPasted] = useState(false);

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
        "Invalid URL. Expected: https://github.com/owner/repo/issues/123",
      );
      return;
    }

    onSubmit(url);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError("");
      setPasted(true);
      setTimeout(() => setPasted(false), 1500);
    } catch {
      setError("Could not read clipboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body gap-5 p-6 sm:p-8">
          {/* Label */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <label htmlFor="issue-url" className="font-semibold text-base-content">
              GitHub Issue URL
            </label>
          </div>

          {/* Input row */}
          <div className="join w-full">
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
              className={`input join-item flex-1 bg-base-100 font-mono text-sm focus:outline-none focus:border-primary ${
                error ? "border-error focus:border-error" : "border-base-300"
              }`}
            />
            <button
              type="button"
              onClick={handlePaste}
              disabled={isLoading}
              className="btn join-item btn-outline border-base-300 gap-2 min-w-24"
              title="Paste from clipboard"
            >
              {pasted ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-success" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-success text-xs">Pasted</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  <span className="text-xs">Paste</span>
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-error text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Hint */}
          {!error && (
            <p className="text-xs text-base-content/40">
              Example:{" "}
              <span className="font-mono">
                https://github.com/vercel/next.js/issues/1234
              </span>
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full gap-2 mt-1"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Analyzing…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Analyze Issue
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
