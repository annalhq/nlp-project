"use client";

export default function Header() {
  return (
    <div className="navbar bg-base-100 border-b border-base-200 px-4 sm:px-8">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-9">

            </div>
          </div>
          <div>
            <p className="font-bold text-base leading-tight">GitHub Issues</p>
            <p className="text-xs text-base-content/50 leading-tight">
              Extract and analyze issue threads
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
