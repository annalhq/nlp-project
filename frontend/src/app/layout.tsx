import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Issue Summarizer",
  description: "Extract and summarize GitHub issue threads with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-base-100 text-base-content">
        {children}
      </body>
    </html>
  );
}
