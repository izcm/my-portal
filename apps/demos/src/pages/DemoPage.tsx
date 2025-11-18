import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

import { isAddress } from "viem";

// local
import {
  readTotalSupply,
  readOwnerOf,
  readBalanceOf,
  fetchMyTokens,
  readSVG,
} from "../web3/miniNFT/read";
import { useMint, useTransfer, useSetColor } from "../web3/miniNFT/write";

import { demos } from "../data/demos";
import { DemoLayout } from "../components/layouts/DemoLayout";

import { NFTCarosel } from "../components/NFTCarosel";
import { Modal } from "../components/Modal";
import { ColorWheel } from "../components/ColorWheel";

import blushSvgText from "/icons/miniNFT/default_mini.svg?raw";
import type { UI_NFT } from "../data/UI_NFT";

export type LogEntry = {
  type: "success" | "error" | "info";
  message: string;
};

// ❗ TODO: for write events [Gas Usage] in log entry
// ❗ TODO: randomize color on reopening of modal for more "fun" vibe
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

  /* NFTs owned by wallet */
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

  const [indexActiveNFT, setIndexActiveNFT] = useState(0);

  // modal stuff
  const [modal, setModal] = useState<{
    open: boolean;
    action: "ownerOf" | "balanceOf" | "mint" | "transfer" | "color" | null;
  }>({
    open: false,
    action: null,
  });
  const closeModal = () => setModal({open: false, action: null});
  const [color, setColor] = useState("#ffffff");
  const [readArgument, setReadArgument] = useState("");

  // external calls
  const mintTx = useMint(wallet);
  const transferTx = useSetColor(wallet);
  const setColorTx = useSetColor(wallet);

  const actions = {
    /* WRITE ACTIONS */
    mint: {
      label: "Mint to which address?",
      placeholder: "",
      btnTxtPrimary: "⛏ Mint New",
      btnTxtSecondary: "Mint",
      topBar: true,
      modal: true,
      action: async () => {
        const colorNumber = BigInt("0x" + color.slice(1));
        mintTx.mint(wallet as `0x${string}`, colorNumber);

        return `⛏ Minted to ${wallet}`;
      },
    },
    transfer: {
      label: "Transfer to what address?",
      placeholder: "0xabc123",
      btnTxtPrimary: "Transfer",
      btnTxtSecondary: "Execute Transfer",
      topBar: false,
      modal: true,
      action: async (input: string) => {
        const balance = await readBalanceOf(input as `0x${string}`);
        return `🔢 Balance = ${balance}`;
      },
    },
    color: {
      label: "Set NFT Color",
      placeholder: "",
      btnTxtPrimary: "Change NFT Color",
      btnTxtSecondary: "Set Color",
      topBar: false,
      modal: true,
      action: async () => {
        const colorNumber = BigInt("0x" + color.slice(1));
        setColorTx.setColor(colorNumber, BigInt(indexActiveNFT + 1));

        return `🖍 New Color #${indexActiveNFT}  = ${color}`;
      },
    },

    /* READ ACTIONS */
    totalSupply: {
      label: "Mint to which address?",
      placeholder: "address",
      btnTxtPrimary: " 📊 Supply",
      topBar: true,
      modal: false,
      action: async () => {
        const supply = await readTotalSupply();
        pushLog({
          type: "info",
          message: `📊 Total Supply = ${supply}`,
        });
      },
    },
    ownerOf: {
      label: "Owner of which token?",
      placeholder: "tokenId",
      btnTxtPrimary: "🔍 Owner",
      btnTxtSecondary: "Read Owner",
      topBar: true,
      modal: true,
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
      placeholder: "0xabc123",
      btnTxtPrimary: "🔢 Balances",
      btnTxtSecondary: "Read Balance",
      topBar: true,
      modal: true,
      action: async (input: string) => {
        const balance = await readBalanceOf(input as `0x${string}`);
        return `🔢 Balance = ${balance}`;
      },
    },
  } as const;

  // input validation
  const validInput = (() => {
    if (modal.action === "balanceOf" || modal.action === "transfer") {
      return isAddress(readArgument);
    }
    if (modal.action === "ownerOf") {
      return /^\d+$/.test(readArgument);
    }
    return false;
  })();

  const mode = modal.action ? actions[modal.action] : null;

  // log outputs
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const pushLog = (entry: LogEntry) => {
    setLogs((prev) => [...prev, entry]);
  };

  // external calls lifecycle trackers
  const [activeTx, setActiveTx] = useState<
    "mint" | "color" | "transfer" | null
  >(null);

  const txStatus =
    activeTx === "mint"
      ? mintTx.status
      : activeTx === "color"
        ? setColorTx.status
        : activeTx === "transfer"
          ? transferTx.status
          : null;

  const txMessage =
    txStatus === "wallet"
      ? "🔐 Waiting for wallet..."
      : txStatus === "sent"
        ? "🚀 Transaction sent..."
        : txStatus === "mining"
          ? "⛏ Mining on chain..."
          : txStatus === "success"
            ? "✅ Success!"
            : txStatus === "reverted"
              ? "❌ Transaction failed"
              : "";

  useEffect(() => {
    if (txStatus === "success") {
      pushLog({ type: "success", message: "🎉 Transaction succeeded!" });
    }

    if (txStatus === "reverted") {
      pushLog({ type: "error", message: "❌ Transaction failed" });
    }
  }, [txStatus]);

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
            {Object.entries(actions)
              .filter(([_, action]) => action.topBar)
              .map(([key, action]) => (
                <button
                  key={key}
                  disabled={status === "pending"}
                  onClick={async () => {
                    if (action.modal) {
                      setModal({ open: true, action: key as any });
                    } else {
                      await action.action();
                    }
                  }}
                  className={`
                  btn ${key === "mint" ? "btn-primary" : "btn-secondary"} 
                  flex items-center gap-2
                `}
                >
                  {action.btnTxtPrimary}
                </button>
              ))}
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
                <div className="flex gap-1 text-md">
                  {Object.entries(actions)
                    .filter(([_, action]) => !action.topBar)
                    .map(([key, action]) => (
                      <button
                        key={key}
                        onClick={async () => {
                          setModal({ open: true, action: key as any });
                        }}
                        className="token-action"
                      >
                        [ {action.btnTxtPrimary} ]
                      </button>
                    ))}
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
              <li>Fun & Alternative bitpacking</li>
              <li>Teaches ABI encoding / decoding</li>
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
      {mode && (
        /* MINT */
        <Modal
          isOpen={modal.open}
          onClose={closeModal}
        >
          {modal.action === "mint" || modal.action === "color" ? (
            <div
              className="
              flex items-center gap-4 p-4 bg-black/10
              "
            >
              <div className="flex flex-col gap-4">
                <div
                  className="w-45 bg-black/30 rounded-lg"
                  dangerouslySetInnerHTML={{
                    __html: blushSvgText.replace(
                      /stroke='[^']*'/g,
                      `stroke='${color}'`,
                    ),
                  }}
                />
                <div className="flex flex-col gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setActiveTx("color");

                      (mode.action as () => Promise<string>)();
                      closeModal();
                    }}
                  >
                    {mode.btnTxtSecondary}
                  </button>
                  <button
                    onClick={() => {
                      closeModal();
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-50 mb-4">
                <p className="text-muted tracking-wide uppercase mb-2">
                  Choose color
                </p>
                <ColorWheel onChange={setColor} size={160} />
              </div>
            </div>
          ) : (
            /* OTHER */
            <div className="flex flex-col items-center gap-4 p-8">
              <div className="flex flex-col gap-4 self-stretch mx-4 my-2">
                <span>{mode.label}</span>
                <input
                  placeholder={mode.placeholder}
                  onChange={(e) => setReadArgument(e.target.value)}
                  className="
            border border-default rounded-lg p-1
            bg-black/30
          "
                />
              </div>
              <button
                disabled={!validInput}
                onClick={async () => {
                  closeModal();
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
                {mode.btnTxtSecondary}
              </button>
            </div>
          )}
        </Modal>
      )}
      {(txStatus === "wallet" || txStatus === "mining") && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="text-white text-lg font-mono animate-pulse">
            {txMessage}
          </div>
        </div>
      )}
    </>
  );
};
