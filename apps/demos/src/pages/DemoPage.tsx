import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

// data
import { demos } from "../shared/data/demos";

// components
import { DemoLayout } from "../shared/layouts/DemoLayout";

export type LogEntry = {
  type: "success" | "error" | "info";
  message: string | React.ReactNode;
};

// ❗ TODO: add historical data dashboard / lookup view
export const DemoPage = () => {
  const { address: wallet, isConnected } = useAccount();

  const { demoId } = useParams();
  const demo = demos.find((d) => d.id === demoId);
  const DemoComponent = demo?.demo;

  // View switcher state
  const [currentView, setCurrentView] = useState<"interactive" | "historical">(
    "interactive",
  );

  // early exits
  if (!demo) {
    return (
      <div className="text-center text-red-400 mt-20">Demo not found.</div>
    );
  }

  if (!isConnected || !wallet) {
    return <p className="text-center mt-10">Please connect a wallet first.</p>;
  }

  // ===================================
  //  JSX RETURN
  // ===================================

  return (
    <>
      <DemoLayout
        title={demo.title}
        desc={demo.desc}
        code={`/code_previews/${demo.id}`}
        repo={`${demo.repo}`}
        contract={`${demo.contract}`}
        currentView={currentView}
        onViewChange={setCurrentView}
        showViewSwitcher={true}
      >
        {DemoComponent && <DemoComponent wallet={wallet} />}
      </DemoLayout>
    </>
  );
};
