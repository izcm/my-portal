import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

// local
import { useSvg, useTotalSupply } from "../web3/hooks/mini721/read";
import { useMint } from "../web3/hooks/mini721/write";

import { demos } from "../data/demos";
import { DemoLayout } from "../components/layouts/DemoLayout";

import { MintNFTDisplay } from "../components/NFTCarosel";

import { Modal } from "../components/Modal";
import { ActionLog } from "../components/ActionLog";
import type { LogEntry } from "../components/ActionLog";

// ❗ TODO: for write events [Gas Usage] in log entry
export const DemoPage = () => {
  const { address, isConnected } = useAccount();

  const { demoId } = useParams();
  const demo = demos.find((d) => d.id === demoId);

  if (!demo) {
    return (
      <div className="text-center text-red-400 mt-20">Demo not found.</div>
    );
  }

  if (!isConnected || !address) {
    return <p className="text-center mt-10">Please connect a wallet first.</p>;
  }

  const { mint, status } = useMint(address);
  const { readTotalSupply, totalSupply } = useTotalSupply();

  const [showMintModal, setShowMintModal] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const pushLog = (entry: LogEntry) => {
    setLogs((prev) => [...prev, entry]);
  };

  const svg = useSvg();

  return (
    <>
      <DemoLayout
        title={demo.title}
        desc={demo.desc}
        codeUrl="https://example.com/code"
        repoUrl="https://github.com/a2zblocks/example"
        contractUrl="https://etherscan.io/address/0x123"
      >
        <div className="flex flex-col items-center gap-6">
          {/* Actinon Buttons */}
          <div className="flex flex-row items-center gap-3 bg-soft/20 rounded-xl border border-soft">
            {/* ✅ PRIMARY MINT BUTTON */}
            <button
              disabled={status === "pending"}
              onClick={() => setShowMintModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              🎨 Mint New
            </button>

            {/* ✅ SECONDARY: TOTAL SUPPLY */}
            <button
              onClick={async () => {
                const supply = await readTotalSupply();
                pushLog({
                  type: "info",
                  message: `ℹ️ Total Supply = ${supply}`,
                });
              }}
              className="btn btn-secondary flex items-center gap-2"
            >
              📊 Supply
            </button>

            {/* ✅ SECONDARY: OWNER OF */}
            <button
              onClick={() => {
                pushLog({
                  type: "info",
                  message: "🔍 Owner lookup not implemented yet",
                });
              }}
              className="btn btn-secondary flex items-center gap-2"
            >
              🔍 Owner
            </button>

            {/* ✅ SECONDARY: BALANCE OF */}
            <button
              onClick={() => {
                pushLog({
                  type: "info",
                  message: "👤 Balance lookup not implemented yet",
                });
              }}
              className="btn btn-secondary flex items-center gap-2"
            >
              👤 Balance
            </button>
          </div>

          {/* NFT Preview*/}
          <div
            className="
              w-80 h-64
              grid place-items-center
              border border-soft rounded-lg
              text-start
            "
          >
            {!svg ? (
              <p>Loading SVG...</p>
            ) : (
              <div className="flex flex-col justify-center items-center  ">
                <img width={160} src={svg} alt="NFT preview" />
                <div className="flex flex-col gap-1 text-md">
                  <span>Token #3 • Owner: 0x1234…abcd</span>
                  <span>[ Transfer ] [ Change NFT Color ]</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Log / Status Box */}
          <div className="h-40 w-80 border border-soft rounded-lg text-start">
            <ActionLog logs={logs} />
          </div>

          {/* Seperator */}
          <div className="h-[1px] w-1/2 bg-secondary" />

          {/* About Section */}
          <div className="text-start">
            <h3 className="font-semibold">About Mini721</h3>
            <ul>
              <li>100& Yul — no Solidity, no OZ </li>
              <li>Gas-lean storage layout (single mapping)</li>
              <li>Minimal ERC-721: mint + transfer + events</li>
              <li>
                Teaches selector handling, sstore, logs on an OpCode level
              </li>
            </ul>
          </div>

          {/* Seperator */}
          <div className="h-[1px] w-1/2 bg-secondary" />

          {/* Technical Specifications */}
          <div className="text-start">
            <h3 className="font-semibold">About Mini721</h3>
            <ul>
              <li>100& Yul — no Solidity, no OZ </li>
              <li>Gas-lean storage layout (single mapping)</li>
              <li>Minimal ERC-721: mint + transfer + events</li>
              <li>
                Teaches selector handling, sstore, logs on an OpCode level
              </li>
            </ul>
          </div>
        </div>
      </DemoLayout>

      <Modal isOpen={showMintModal} onClose={() => setShowMintModal(false)}>
        <MintNFTDisplay />
      </Modal>
    </>
  );
};
