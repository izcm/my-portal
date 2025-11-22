// src/components/layouts/DemoLayout.tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// ions
import { Link, Code, Github } from "lucide-react";

type DemoLayoutProps = {
  title: string;
  desc: string;
  children: ReactNode; // <-- your interactive demo goes here
  codeUrl?: string;
  repoUrl?: string;
  contractUrl?: string;
  // View switcher props
  currentView?: "interactive" | "historical";
  onViewChange?: (view: "interactive" | "historical") => void;
  showViewSwitcher?: boolean;
};

const headerActions = [
  {
    icon: Code,
    onClick: () => {
      console.log("Opening modal...");
    },
    alt: "Contract Code",
  },
  {
    icon: Github,
    link: "https://github.com/izcm/yul-miniNFT",
    alt: "Github Repository",
  },
  {
    icon: Link,
    link: "https://etherscan.io/",
    alt: "NFT etherscan link",
  },
];

export const DemoLayout = ({
  title,
  desc,
  children,
  codeUrl,
  repoUrl,
  contractUrl,
  currentView = "interactive",
  onViewChange,
  showViewSwitcher = false,
}: DemoLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="
          min-h-screen flex flex-col gap-2 items-center py-8 fade-in"
    >
      {/* TOPBAR */}
      <header className="w-full max-w-4xl flex justify-between items-center px-4 mb-4 text-sm relative">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="btn">
            ← Back
          </button>
        </div>

        {/* CENTER - ACTION BUTTONS */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-4 shrink-0">
          {headerActions.map((item, i) => {
            const Icon = item.icon;

            const commonClasses =
              "w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-soft hover:scale-108 transition-transform flex items-center justify-center shrink-0";

            return item.onClick ? (
              <button
                key={i}
                onClick={item.onClick}
                className={`${commonClasses} cursor-pointer`}
              >
                <Icon />
              </button>
            ) : (
              <a
                key={i}
                href={item.link}
                target="_blank"
                className={commonClasses}
              >
                <Icon />
              </a>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-end">
          {/* VIEW SWITCHER */}
          {showViewSwitcher && onViewChange && (
            <div className="hidden md:flex border border-soft rounded-lg overflow-hidden">
              <button
                onClick={() => onViewChange("interactive")}
                className={`px-4 py-2 text-sm transition-colors ${
                  currentView === "interactive"
                    ? "bg-primary text-surface font-medium"
                    : "text-muted hover:text-primary hover:bg-surface/30"
                }`}
              >
                Interactive
              </button>
              <button
                onClick={() => onViewChange("historical")}
                className={`px-4 py-2 text-sm transition-colors ${
                  currentView === "historical"
                    ? "bg-primary text-surface font-medium"
                    : "text-muted hover:text-primary hover:bg-surface/30"
                }`}
              >
                Historical
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-3xl flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold glow">{title}</h1>
        <p className="text-dim text-sm">{desc}</p>

        {/* DEMO CONTAINER */}
        <div className="w-full border border-default rounded-xl p-6 bg-black/10">
          {children}
        </div>

        {/* ACTION BUTTONS */}
        <div
          className="
            flex flex-col sm:flex-row 
            gap-3 sm:gap-4
            w-full max-w-md sm:max-w-none sm:w-auto 
            mt-4 text-sm
          "
        >
          {codeUrl && (
            <a
              className="btn btn-ghost flex items-center justify-center gap-3 w-full sm:w-auto py-3 px-6"
              href={codeUrl}
              target="_blank"
            >
              <Code className="w-4 h-4 opacity-80" />
              <span>View Code</span>
            </a>
          )}

          {repoUrl && (
            <a
              className="btn btn-ghost flex items-center justify-center gap-3 w-full sm:w-auto py-3 px-6"
              href={repoUrl}
              target="_blank"
            >
              <Github className="w-4 h-4 opacity-80" />
              <span>GitHub Repo</span>
            </a>
          )}

          {contractUrl && (
            <a
              className="btn btn-ghost flex items-center justify-center gap-3 w-full sm:w-auto py-3 px-6"
              href={contractUrl}
              target="_blank"
            >
              <Link className="w-4 h-4 opacity-80" />
              <span>Contract Explorer</span>
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
