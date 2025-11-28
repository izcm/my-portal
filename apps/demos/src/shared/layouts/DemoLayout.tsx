// src/components/layouts/DemoLayout.tsx
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// ions
import { Link, Code, Github } from "lucide-react";

// local
import { Modal } from "../components/Modal";

type DemoLayoutProps = {
  title: string;
  desc: string;
  children: ReactNode;
  code?: string;
  repo?: string;
  contract?: string;
  // View switcher props
  currentView?: "interactive" | "historical";
  onViewChange?: (view: "interactive" | "historical") => void;
  showViewSwitcher?: boolean;
};

export const DemoLayout = ({
  title,
  desc,
  children,
  code,
  repo,
  contract,
  currentView = "interactive",
  onViewChange,
  showViewSwitcher = false,
}: DemoLayoutProps) => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const links = [
    {
      icon: Code,
      onClick: () => {
        setModalOpen(true);
        console.log("Opening modal...");
      },
      alt: "Contract Code",
      text: "View Code",
    },
    {
      icon: Github,
      link: `https://github.com/izcm/${repo}`,
      alt: "Github Repository",
      text: "Github Repo",
    },
    {
      icon: Link,
      link: `https://etherscan.io/address/${contract}`,
      alt: "NFT etherscan link",
      text: "Contract Explorer",
    },
  ];

  console.log(links[2].link);

  return (
    <>
      <div
        className="
          flex flex-col gap-2 items-center py-8 fade-in"
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
            {links.map((item, i) => {
              const Icon = item.icon;

              const commonClasses =
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-soft hover:scale-108 transition-transform flex items-center justify-center shrink-0";

              return item.onClick ? (
                <button
                  disabled
                  key={i}
                  onClick={item.onClick}
                  className={`${commonClasses} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
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

          {/* BOTTOM ACTION BUTTONS */}
          <div
            className="
            flex flex-col sm:flex-row 
            gap-3 sm:gap-4
            w-full max-w-md sm:max-w-none sm:w-auto 
            mt-4 text-sm
          "
          >
            {links.map((item, i) => {
              const Icon = item.icon;

              const commonClasses =
                "btn btn-ghost flex items-center justify-center gap-3 w-full sm:w-auto py-3 px-6";
              const iconClasses = "w-4 h-4 opacity-80";

              return item.onClick ? (
                <button
                  disabled
                  key={i}
                  onClick={item.onClick}
                  className={`${commonClasses} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Icon className={iconClasses} />
                  <span>{item.text}</span>
                </button>
              ) : (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  className={commonClasses}
                >
                  <Icon className={iconClasses} />
                  <span>{item.text}</span>
                </a>
              );
            })}
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed  z-[999]">
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            children={undefined}
          />
        </div>
      )}
    </>
  );
};
