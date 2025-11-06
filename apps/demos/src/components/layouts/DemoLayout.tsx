// src/components/layouts/DemoLayout.tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type DemoLayoutProps = {
  title: string;
  desc: string;
  children: ReactNode; // <-- your interactive demo goes here
  codeUrl?: string;
  repoUrl?: string;
  contractUrl?: string;
};

export const DemoLayout = ({
  title,
  desc,
  children,
  codeUrl,
  repoUrl,
  contractUrl,
}: DemoLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="
          min-h-screen flex flex-col items-center px-6 py-10 fade-in bg-primary"
    >
      {/* TOPBAR */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-4 text-sm text-dim">
        <button onClick={() => navigate(-1)} className="ink">
          ← Back
        </button>
        <span className="opacity-60">A2Z Blocks</span>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-3xl flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold glow">{title}</h1>
        <p className="text-dim text-sm">{desc}</p>

        {/* DEMO CONTAINER */}
        <div className="w-full border border-soft rounded-xl p-6 bg-black/30 backdrop-blur-sm">
          {children}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 mt-4 text-sm">
          {codeUrl && (
            <a className="btn btn-ghost" href={codeUrl} target="_blank">
              🔍 View Code
            </a>
          )}
          {repoUrl && (
            <a className="btn btn-ghost" href={repoUrl} target="_blank">
              📦 GitHub Repo
            </a>
          )}
          {contractUrl && (
            <a className="btn btn-ghost" href={contractUrl} target="_blank">
              🌐 Contract Explorer
            </a>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto text-xs text-dim py-6">
        © 2025 A2Z Blocks — Humbly built.
      </footer>
    </div>
  );
};
