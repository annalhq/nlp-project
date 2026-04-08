"use client";

import { useState } from "react";

interface InputFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

export default function InputForm({ onSubmit, isLoading = false }: InputFormProps) {
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
    if (!url.trim()) { setError("Please enter a GitHub issue URL"); return; }
    if (!isValidGithubUrl(url)) { setError("Invalid URL. Expected: https://github.com/owner/repo/issues/123"); return; }
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

  const hasValue = url.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      {/* ── URL input card ── */}
      <div
        className={`flex items-center rounded-2xl border bg-base-200 transition-all duration-200 overflow-hidden shadow-sm ${
          error
            ? "border-error/60 shadow-error/10"
            : "border-base-300 focus-within:border-primary/50 focus-within:shadow-primary/8 focus-within:shadow-md"
        }`}
      >
        {/* Icon prefix */}
        <div className="shrink-0 pl-4 text-base-content/30">
          <GithubIcon />
        </div>

        {/* Text input */}
        <input
          id="issue-url"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="https://github.com/owner/repo/issues/123"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-3.5 text-sm font-mono text-base-content placeholder-base-content/30 focus:outline-none disabled:opacity-50"
        />

        {/* Paste button */}
        <button
          type="button"
          onClick={handlePaste}
          disabled={isLoading}
          title="Paste from clipboard"
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 mr-1.5 my-1.5 rounded-xl text-xs font-semibold text-base-content/50 hover:text-base-content hover:bg-base-300 transition-all duration-150 disabled:opacity-40"
        >
          {pasted ? (
            <>
              <CheckIcon />
              <span className="text-success">Pasted</span>
            </>
          ) : (
            <>
              <ClipboardIcon />
              <span className="hidden sm:inline">Paste</span>
            </>
          )}
        </button>
      </div>

      {/* ── Error / hint text ── */}
      <div className="h-4 px-1">
        {error ? (
          <p className="flex items-center gap-1.5 text-xs text-error font-medium">
            <AlertIcon />
            {error}
          </p>
        ) : (
          <p className="text-xs text-base-content/35">
            Example:{" "}
            <span className="font-mono">
              github.com/vercel/next.js/issues/1234
            </span>
          </p>
        )}
      </div>

      {/* ── Submit button ── */}
      <button
        type="submit"
        disabled={isLoading || (!hasValue && !isLoading)}
        className="btn btn-primary w-full gap-2 rounded-xl shadow-sm transition-all"
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Analyzing…
          </>
        ) : (
          <>
            Analyze Issue
            <ArrowRightIcon />
          </>
        )}
      </button>
    </form>
  );
}
