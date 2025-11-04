// src/App.tsx
import { Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { HomePage } from "./pages/HomePage";
import { DemoPage } from "./pages/DemoPage";

import { config } from "./web3/config";

const queryClient = new QueryClient()

export const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:demoId" element={<DemoPage />} />
      </Routes>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
