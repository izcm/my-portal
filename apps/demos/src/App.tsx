// src/App.tsx
import { Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { HomePage } from "./pages/HomePage";
import { DemoPage } from "./pages/DemoPage";

import { wagmiConfig } from "./shared/web3/config";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col">
          <main className="flex-1 min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:demoId" element={<DemoPage />} />
            </Routes>
          </main>

          <footer className="text-xs text-muted py-6 text-center">
            © 2025 A2Z Blocks — Humbly built.
          </footer>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
