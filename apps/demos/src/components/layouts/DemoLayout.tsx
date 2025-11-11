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

const headerActions = [
  {
    logo: "icons/code_brackets.svg",
    onClick: () => {
      console.log("Opening modal...");
    },
    alt: "Contract Code",
  },
  {
    logo: "/icons/github.svg",
    link: "https://github.com/izcm/yul-miniNFT",
    alt: "Github Repository",
  },
  {
    logo: "/icons/chain.svg",
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
}: DemoLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="
          min-h-screen flex flex-col items-center py-8 fade-in"
    >
      {/* TOPBAR */}
      <header className="w-full max-w-4xl flex justify-between items-center px-4 mb-4 text-sm">
        <button onClick={() => navigate(-1)} className="btn">
          ← Back
        </button>
        <div className="flex gap-4">
          {headerActions.map((item, i) => {
            const commonClasses =
              "w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-soft hover:scale-108 transition-transform flex items-center justify-center";

            return item.onClick ? (
              <button
                key={i}
                onClick={item.onClick}
                className={`${commonClasses} cursor-pointer`}
              >
                <img src={item.logo} alt={item.alt} className="w-full h-full object-cover" />
              </button>
            ) : (
              <a
                key={i}
                href={item.link}
                target="_blank"
                className={commonClasses}
              >
                <img src={item.logo} alt={item.alt} className="w-full h-full object-cover" />
              </a>
            );
          })}

        </div>
        <span className="opacity-60">A2Z Blocks</span>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-3xl flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold glow">{title}</h1>
        <p className="text-dim text-sm">{desc}</p>

        {/* DEMO CONTAINER */}
        <div className="w-full border border-default rounded-xl p-6 bg-black/30">
          {children}
        </div>

        {/* ACTION BUTTONS */}
        <div
          className="
            flex flex-col sm:flex-row flex-wrap gap-3 
            sm:w-auto w-1/2 mt-4 text-sm
            "
        >
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
