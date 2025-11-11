import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

import { isAddress } from "viem";

// local
import {
  useTotalSupply,
  readOwnerOf,
  readBalanceOf,
  fetchMyTokens,
  readSVG,
} from "../web3/miniNFT/read";
import { useMint } from "../web3/miniNFT/write";

import { demos } from "../data/demos";
import { DemoLayout } from "../components/layouts/DemoLayout";

import { NFTCarosel } from "../components/NFTCarosel";
import { Modal } from "../components/Modal";

import type { UI_NFT } from "../data/UI_NFT";

const previewNFTs: UI_NFT[] = [
  { label: "BLUSH", svg: "/icons/miniNFT/BLUSH.svg" },
  { label: "EMERALD", svg: "/icons/miniNFT/EMERALD.svg" },
  { label: "MANGO", svg: "/icons/miniNFT/MANGO.svg" },
];

export type LogEntry = {
  type: "success" | "error" | "info";
  message: string;
};

// ❗ TODO: for write events [Gas Usage] in log entry
export const DemoPage = () => {
  const { address: wallet, isConnected } = useAccount();

  const { demoId } = useParams();
  const demo = demos.find((d) => d.id === demoId);

  if (!demo) {
    return (
      <div className="text-center text-red-400 mt-20">Demo not found.</div>
    );
  }

  if (!isConnected || !wallet) {
    return <p className="text-center mt-10">Please connect a wallet first.</p>;
  }

  /* ACTIVE USER'S NFTs */
  const [myNFTs, setMyNFTs] = useState<UI_NFT[]>([]);

  useEffect(() => {
    if (!wallet) {
      setMyNFTs([]); // clear NFTs when wallet disconnects
      return;
    }

    const loadNFTs = async () => {
      try {
        const tokens = await fetchMyTokens(wallet);

        const ownedNFTs = await Promise.all(
          tokens.map(async (id) => {
            const svg = await readSVG(id);
            return {
              label: `Token #${id}`,
              svg: svg || "",
              owned: true,
            } as UI_NFT;
          }),
        );

        setMyNFTs(ownedNFTs);
        console.log("✅ NFTs loaded:", ownedNFTs);
      } catch (err) {
        console.error("❌ Failed to load NFTs:", err);
      }
    };

    loadNFTs();
  }, [wallet]);

  const [indexNFTMint, setIndexNFTMint] = useState(0); // for modal nft carosel
  const [indexActiveNFT, setIndexActiveNFT] = useState(0);

  // WRITE TO CONTARCT STUFF
  const { mint, status } = useMint(wallet);
  const [showMintModal, setShowMintModal] = useState(false);

  // READ FROM CONTARCT STUFF
  const { readTotalSupply } = useTotalSupply();

  const [modal, setModal] = useState<{
    open: boolean;
    action: "ownerOf" | "balanceOf" | "mint" | "transfer" | null;
  }>({
    open: false,
    action: null,
  });

  const [readArgument, setReadArgument] = useState("");

  const actions = {
    mint: {
      label: "Mint to which address?",
      placeholder: "address",
      button: "Mint",
      action: async (input: string) => {
        mint(input as `0x${string}`);
        return `🎨 Minted to ${input}`;
      },
    },
    ownerOf: {
      label: "Owner of which token?",
      placeholder: "tokenId",
      button: "Read Owner",
      action: async (input: string) => {
        const owner = await readOwnerOf(BigInt(input));

        const short =
          owner && owner.length > 10
            ? `${owner.slice(0, 6)}…${owner.slice(-4)}`
            : owner;

        return `🔍 Token #${input} Owner = ${short}`;
      },
    },
    balanceOf: {
      label: "Balance of which address?",
      placeholder: "address",
      button: "Read Balance",
      action: async (input: string) => {
        const balance = await readBalanceOf(input as `0x${string}`);
        return `🔢 Balance = ${balance}`;
      },
    },
    transfer: {
      label: "Balance of which address?",
      placeholder: "address",
      button: "Read Balance",
      action: async (input: string) => {
        const balance = await readBalanceOf(input as `0x${string}`);
        return `🔢 Balance = ${balance}`;
      },
    },
  } as const;

  const mode = modal.action ? actions[modal.action] : null;

  // input validation
  const validInput = (() => {
    if (modal.action === "balanceOf" || modal.action === "transfer") {
      return isAddress(readArgument);
    }
    if (modal.action === "ownerOf") {
      return /^\d+$/.test(readArgument);
    }
    if (modal.action === "mint") {
      return isAddress(readArgument);
    }
    return false;
  })();

  // OUTPUTS
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const pushLog = (entry: LogEntry) => {
    setLogs((prev) => [...prev, entry]);
  };

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
          <div className="flex flex-row items-center gap-3 ">
            {/* PRIMARY MINT BUTTON */}
            <button
              disabled={status === "pending"}
              onClick={() => setShowMintModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              ⛏ Mint New
            </button>

            {/* TOTAL SUPPLY */}
            <button
              onClick={async () => {
                const supply = await readTotalSupply();
                pushLog({
                  type: "info",
                  message: `📊 Total Supply = ${supply.data}`,
                });
              }}
              className="btn btn-secondary flex items-center gap-2"
            >
              📊 Supply
            </button>

            {/* OWNER OF */}
            <button
              onClick={() => {
                setModal({ open: true, action: "ownerOf" });
              }}
              className="btn btn-secondary flex items-center gap-2"
            >
              🔍 Owner
            </button>

            {/* BALANCE OF */}
            <button
              onClick={() => {
                setModal({ open: true, action: "balanceOf" });
              }}
              className="btn btn-secondary flex items-center gap-2"
            >
              🔢 Balances
            </button>
          </div>

          {/* NFT Preview*/}
          <div
            className="
              w-80 h-76
              flex justify-center
              border border-default rounded-lg
            "
          >
            {myNFTs.length === 0 ? (
              <p>Loading SVG...</p>
            ) : (
              <div className="flex flex-col justify-center items-center gap-4">
                <NFTCarosel
                  items={myNFTs}
                  index={indexActiveNFT}
                  onChange={setIndexActiveNFT}
                />
                <div className="flex flex-col gap-1 text-md">
                  {/* <span>Token #3 • Owner: 0x1234…abcd</span> */}
                  <div className="flex gap-2">
                    <button className="token-action">
                      [ Transfer ]
                    </button>
                    <button className="token-action">
                      [ Change NFT Color ]
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Log / Status Box */}
          <div
            className="
              h-40 w-80
              text-sm text-start 
              border border-default rounded-lg 
              overflow-y-auto overflow-x-hidden p-2
              "
          >
            {logs.length === 0 && (
              <p className="text-subtle text-center mt-2">No actions yet...</p>
            )}

            {logs.map((log, i) => (
              <p
                key={i}
                className={`log-line ${
                  log.type === "success"
                    ? "text-green-400"
                    : log.type === "error"
                      ? "text-red-400"
                      : "text-slate-300"
                }`}
              >
                {log.message}
              </p>
            ))}
          </div>

          {/* About & Specs */}
          <div className="flex flex-col gap-4 w-1/2 min-w-[320px] text-start">
            {/* Seperator */}
            <div className="h-[1px] border border-soft" />

            {/* About */}
            <h3 className="font-semibold">About MiniNFT</h3>
            <ul className="list-cyber font-mono text-sm space-y-1 text-muted">
              <li>Mint + transfer + events</li>
              <li>Teaches selector handling, sstore, logs</li>
              <li>
                Plays with different mapping styles:
                <ul className="not-list-cyber list-sub py-1 text-sm text-muted">
                  <li>Simple linear mapping</li>
                  <li>Realistic keccak(key, base)</li>
                </ul>
              </li>
            </ul>

            {/* Seperator */}
            <div className="h-[1px] border border-soft" />

            {/* Technical Specifications */}
            <h3 className="font-semibold">Spec Sheet</h3>
            <ul className="list-cyber font-mono text-sm space-y-1 text-muted">
              <li>Bytecode Size: ~400 bytes</li>
              <li>
                Storage
                <ul className="not-list-cyber list-sub py-1 text-sm text-muted">
                  <li>2 x mappings</li>
                  <li>1 x uint256 bitpacked</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* DISCLAIMER */}
          <div className="border-t border-b border-default text-accent my-8 px-2 py-4">
            <p>
              ⚠ <strong>NB:</strong> Though MiniNFT is an NFT, it does not
              comply with the ERC721 standard.
            </p>
            <p>Minis will not display in any wallet. 👻</p>
          </div>
        </div>
      </DemoLayout>

      {/* MODAL */}
      <Modal isOpen={showMintModal} onClose={() => setShowMintModal(false)}>
        <div className="flex flex-col items-center gap-4">
          <NFTCarosel
            items={previewNFTs}
            index={indexNFTMint}
            onChange={setIndexNFTMint}
          />
          <button className="btn btn-primary mt-3" onClick={() => mint(wallet)}>
            Mint Selected
          </button>
        </div>
      </Modal>
      {mode && (
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, action: null })}
        >
          {modal.action === "mint" ? (
            <div className="flex flex-col items-center gap-4">
              <NFTCarosel
                items={previewNFTs}
                index={indexNFTMint}
                onChange={setIndexNFTMint}
              />
              <button
                className="btn btn-primary mt-3"
                onClick={() => mint(wallet)}
              >
                Mint Selected
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col gap-4 self-stretch mx-4 my-2">
                <span>{mode.label}</span>
                <input
                  placeholder={mode.placeholder}
                  onChange={(e) => setReadArgument(e.target.value)}
                  className="
                  input input-primary 
                  border border-default rounded-lg p-1
                  bg-black/30
                "
                />
              </div>
              <button
                disabled={!validInput}
                onClick={async () => {
                  setModal({ open: false, action: null });
                  try {
                    const msg = await mode.action(readArgument);
                    pushLog({ type: "info", message: msg });
                  } catch (err) {
                    pushLog({
                      type: "error",
                      message: `❌ ${(err as Error).message || "Action failed"}`,
                    });
                  }
                }}
                className={`btn btn-secondary ${!validInput ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {mode.button}
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};
