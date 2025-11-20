import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

// local (web3 read + write)
import {
  readTotalSupply,
  readOwnerOf,
  readBalanceOf,
} from "../features/miniNFT/web3/actions/read";
import {
  useMint,
  useTransfer,
  useSetColor,
} from "../features/miniNFT/web3/hooks/write";

// local (data + components + utils)
import { useNFTGallery } from "../features/miniNFT/hooks/useNFTGallery";
import { demos } from "../shared/data/demos";
import { makeActionConfig } from "../features/miniNFT/data/UI_ACTION_CONFIG";

import { DemoLayout } from "../shared/layouts/DemoLayout";
import { NFTCarosel } from "../features/miniNFT/components/Carosel";
import { NFTModal } from "../features/miniNFT/components/ModalContent";
import { LoadingSpinner } from "../shared/components/LoadingSpinner";
import { shortenAddr } from "../shared/utils/strings";

// -----------------------------
// Types
// -----------------------------
export type LogEntry = {
  type: "success" | "error" | "info";
  message: string;
};

// =====================================================================
//                         COMPONENT START
// =====================================================================

export const DemoPage = () => {
  // -----------------------------
  // routing + wallet connection
  // -----------------------------
  const { address: wallet, isConnected } = useAccount();
  const { demoId } = useParams();
  const demo = demos.find((d) => d.id === demoId);

  // early exits
  if (!demo) {
    return (
      <div className="text-center text-red-400 mt-20">Demo not found.</div>
    );
  }

  if (!isConnected || !wallet) {
    return <p className="text-center mt-10">Please connect a wallet first.</p>;
  }

  // =====================================================================
  //                         WEB3 TX HOOKS
  // =====================================================================

  // -----------------------------
  // web3 tx & lifecycle
  // -----------------------------
  const mintTx = useMint(wallet);
  const transferTx = useTransfer(wallet);
  const setColorTx = useSetColor(wallet);

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

  // =====================================================================
  //                         WEB3 READ ACTIONS
  // =====================================================================

  const handleResult = (res: any, label: string) => {
    if (!res.ok) {
      pushLog({ type: "error", message: res.error! });
    } else {
      pushLog({ type: "info", message: `${label}: ${res.data}` });
    }
  };

  /*
  const READ_ACTIONS = {
    totalSupply: async () => {
      const res = await readTotalSupply();
      handleResult(res, "📊 Total Supply");
    },

    ownerOf: async (arg: string) => {
      const res = await readOwnerOf(BigInt(arg));
      if (!res.ok) return handleResult(res, "Owner"); 

      const short = shortenAddr(res.data!);
      pushLog({ type: "info", message: `🔍 Owner: ${short}` });
    },

    balanceOf: async (arg: string) => {
      const res = await readBalanceOf(arg);
      handleResult(res, "Balance");
    },
  } as const;
   */

  // =====================================================================
  //                         UI ACTION CONFIG
  // =====================================================================

  const UI_ACTIONS = makeActionConfig();

  // write keys
  const WRITE_KEYS = ["mint", "color", "transfer"] as const;
  type WriteActionKey = (typeof WRITE_KEYS)[number];

  const isWriteKey = (key: string): key is WriteActionKey =>
    (WRITE_KEYS as readonly string[]).includes(key);

  // =====================================================================
  //                         NFT GALLERY
  // =====================================================================

  const {
    userNFTs: myNFTs,
    isGalleryLoading,
    updateSVG,
    addNewNFT,
  } = useNFTGallery(wallet);

  const [indexActiveNFT, setIndexActiveNFT] = useState(0);
  const activeTokenId =
    myNFTs.length > 0 ? myNFTs[indexActiveNFT].tokenId : null;

  // =====================================================================
  //                         MODAL + LOG STATE
  // =====================================================================

  const [modal, setModal] = useState<{
    open: boolean;
    key: keyof typeof UI_ACTIONS;
  }>({
    open: false,
    key: "mint",
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };

  const mode = UI_ACTIONS[modal.key];

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const pushLog = (entry: LogEntry) =>
    setLogs((prev) => [...prev, entry]);

  // =====================================================================
  //                         WRITE + READ HANDLERS
  // =====================================================================

  const handleWrite = ({
    key,
    argument,
    color,
  }: {
    key: string;
    argument: string;
    color: string;
  }) => {
    if (activeTokenId === null) return;

    if (key === "mint") {
      const c = BigInt("0x" + color.slice(1));
      mintTx.mint(wallet, c);
      setActiveTx("mint");
    }

    if (key === "color") {
      const c = BigInt("0x" + color.slice(1));
      setColorTx.setColor(activeTokenId, c);
      setActiveTx("color");
    }

    if (key === "transfer") {
      transferTx.transfer(argument as `0x${string}`, activeTokenId);
      setActiveTx("transfer");
    }
  };

  const handleRead = async ({
    key,
    argument,
  }: {
    key: string;
    argument: string | null;
  }) => {
    if (!argument) {
      const res = await readTotalSupply();
      if (!res.ok) {
        pushLog({ type: "error", message: res.error! });
      } else {
        pushLog({
          type: "info",
          message: `📊 Total Supply = ${res.data}`,
        });
      }
    } else {
      if (key === "ownerOf") {
        const res = await readOwnerOf(BigInt(argument));
        const owner = res !== null ? shortenAddr(res) : "None";
        pushLog({ type: "info", message: `🔍 Owner = ${owner}` });
      }

      if (key === "balanceOf") {
        readBalanceOf(argument);
      }
    }
  };

  // =====================================================================
  //                     EFFECT: TX STATUS LISTENER
  // =====================================================================

  useEffect(() => {
    if (txStatus === "success") {
      let successMsg = "";

      if (activeTx === "color" && activeTokenId !== null) {
        updateSVG(activeTokenId);
      }

      if (activeTx === "mint") {
        const newId = BigInt(mintTx.logs[0].data);
        const to = mintTx.logs[0].args.to;

        const newNFT = async () => {
          const newIndex = await addNewNFT(newId);
          setIndexActiveNFT(newIndex);
        };
        newNFT();

        successMsg = `⛏ Minted Token #${newId.toString()} to ${shortenAddr(
          to
        )}`;
      }

      pushLog({ type: "success", message: successMsg });
    }

    if (txStatus === "reverted") {
      pushLog({ type: "error", message: "❌ Transaction failed" });
    }
  }, [txStatus]);

  // =====================================================================
  //                         JSX RETURN
  // =====================================================================

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
            {Object.entries(UI_ACTIONS)
              .filter(([_, action]) => action.topBar)
              .map(([key, action]) => (
                <button
                  key={key}
                  onClick={async () => {
                    if (action.modal) {
                      setModal({ open: true, key: key as any });
                    } else {
                      handleRead({ key: key, argument: null });
                    }
                  }}
                  className={`btn ${
                    key === "mint" ? "btn-primary" : "btn-secondary"
                  } flex items-center gap-2`}
                >
                  {action.button}
                </button>
              ))}
          </div>

          {/* NFT Panel */}
          <div className="w-80 h-76 flex justify-center border border-default rounded-lg">
            {isGalleryLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size={36} />
              </div>
            ) : myNFTs.length === 0 ? (
              <div className="flex items-center fade-in">
                <div className="flex flex-col gap-2 items-center">
                  <p>You don't own any Minis.</p>
                  <p>Mint your first 2day?</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-4 animate-[fadeIn_0.5s_ease-out]">
                <NFTCarosel
                  items={myNFTs}
                  index={indexActiveNFT}
                  onChange={setIndexActiveNFT}
                />
                <div className="flex gap-1 text-md">
                  {Object.entries(UI_ACTIONS)
                    .filter(([_, action]) => !action.topBar)
                    .map(([key, action]) => (
                      <button
                        key={key}
                        onClick={async () => {
                          setModal({ open: true, key: key as any });
                        }}
                        className="token-action"
                      >
                        [ {action.button} ]
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Logs */}
          <div className="h-40 w-80 text-sm text-start border border-default rounded-lg overflow-y-auto overflow-x-hidden p-2">
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
            <div className="h-[1px] border border-soft" />

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

            <div className="h-[1px] border border-soft" />

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
        <NFTModal
          open={modal.open}
          mode={mode}
          modeKey={modal.key}
          onClose={closeModal}
          onConfirm={(args) => {
            if (isWriteKey(modal.key)) {
              handleWrite({ key: modal.key, ...args });
            } else {
              handleRead({ key: modal.key, ...args });
            }
          }}
        />
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
