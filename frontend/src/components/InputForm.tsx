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
    <form onSubmit={handleSubmit} className="w-full">
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-sm font-medium">
          GitHub Issue URL
        </legend>
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
          className={`input input-bordered w-full ${error ? "input-error" : ""}`}
        />
        {error && <p className="fieldset-label text-error">{error}</p>}
      </fieldset>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-neutral w-full mt-4"
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing...
          </>
        ) : (
          "Analyze Issue"
        )}
      </button>
    </form>
  );
}
