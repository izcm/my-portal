import { useState, useEffect } from "react";
import { isAddress } from "viem";

// icons
import { CircleAlert } from "lucide-react";

// local (web3 read + write)
import {
  readTotalSupply,
  readOwnerOf,
  readBalanceOf,
} from "./web3/actions/read";

// feature hooks
import { useTxHandler, isWriteKey } from "./hooks/useTxHandler";
import { useNFTGallery } from "./hooks/useNFTGallery";

// data
import { makeActionConfig } from "./data/action_config";

// components
import { NFTCarosel } from "./components/Carosel";
import { NFTModal } from "./components/ModalContent";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";
import { shortenAddr } from "../../shared/utils/strings";

// -----------------------------
// Types
// -----------------------------
export type LogEntry = {
  type: "success" | "error" | "info";
  message: string | React.ReactNode;
};

// ❗ TODO: add historical data dashboard / lookup view
export const MiniNFTDemo = ({ wallet }: { wallet: `0x${string}` }) => {
  // ===================================
  //  WEB3 TX HOOKS
  // ===================================

  const {
    mintTx,
    transferTx,
    setColorTx,
    activeTx,
    setActiveTx,
    txStatus,
    txMessage,
  } = useTxHandler(wallet);

  // ===================================
  //  WEB3 READ ACTIONS
  // ===================================

  const READ_ACTIONS = {
    totalSupply: async () => {
      const res = await readTotalSupply();
      console.log(res);
      handleResult(res, "totalSupply", ":");
    },

    ownerOf: async (arg: string) => {
      const res = await readOwnerOf(BigInt(arg));
      const argFmt = `Token #${arg}: `;
      handleResult(res, "ownerOf", argFmt);
    },

    balanceOf: async (arg: string) => {
      const res = await readBalanceOf(arg);
      const argFmt = `${shortenAddr(arg)}:`;
      handleResult(res, "balanceOf", argFmt);
    },
  } as const;

  // ===================================
  //  UI ACTION CONFIG
  // ===================================

  const UI_ACTIONS = makeActionConfig();

  // All action keys in one place
  const ALL_KEYS = [
    "mint",
    "color",
    "transfer",
    "balanceOf",
    "ownerOf",
    "totalSupply",
  ] as const;
  type ActionKey = (typeof ALL_KEYS)[number];

  const READ_KEYS = ["balanceOf", "ownerOf", "totalSupply"] as const;
  type ReadActionKey = (typeof READ_KEYS)[number];

  const isReadKey = (key: string): key is ReadActionKey =>
    (READ_KEYS as readonly string[]).includes(key);

  // ===================================
  //  NFT GALLERY
  // ===================================

  const {
    userNFTs: myNFTs,
    isGalleryLoading,
    updateSVG,
    addNewNFT,
  } = useNFTGallery(wallet);

  const [indexActiveNFT, setIndexActiveNFT] = useState(0);
  const activeTokenId =
    myNFTs.length > 0 ? myNFTs[indexActiveNFT].tokenId : null;

  // ===================================
  //  MODAL + LOG STATE
  // ===================================

  const [modal, setModal] = useState<{
    open: boolean;
    key: ActionKey;
  }>({
    open: false,
    key: "mint",
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };

  const mode = UI_ACTIONS[modal.key];

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const pushLog = (entry: LogEntry) => setLogs((prev) => [...prev, entry]);

  // ===================================
  //  WRITE + READ HANDLERS
  // ===================================

  const handleResult = (
    res: any,
    key: ActionKey,
    extra: string | null = null,
  ) => {
    if (!res.ok) {
      pushLog({ type: "error", message: res.error! });
    } else {
      const Icon = UI_ACTIONS[key].icon;
      const label = UI_ACTIONS[key].label;

      const type = isWriteKey(key) ? "success" : "info";
      const data = isAddress(res.data) ? shortenAddr(res.data) : res.data;

      pushLog({
        type: type,
        message: (
          <span className="flex items-center gap-1">
            {Icon && <Icon className="w-4 h-4" />}
            <span>
              {label}
              {extra && ` ${extra}`}
            </span>
            <span>{data}</span>
          </span>
        ),
      });
    }
  };

  const handleWrite = ({
    key,
    argument,
    color,
  }: {
    key: string;
    argument: string;
    color: string;
  }) => {
    if (key === "mint") {
      const c = BigInt("0x" + color.slice(1));
      mintTx.mint(wallet, c);
      setActiveTx("mint");
    }

    if (activeTokenId === null) return;

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
    if (!isReadKey(key)) {
      throw Error(`${key} not of type ReadKey!`);
    }

    const fn = READ_ACTIONS[key];

    // argument-less func eg. totalSupply
    if (key === "totalSupply") {
      const fn0 = READ_ACTIONS.totalSupply;
      return fn0(); // fn(argument!) would also work but... being nice to typescript
    }

    // these two need arguments
    if (!argument) {
      throw new Error(`${key} requires an argument`);
    }

    return fn(argument!);
  };

  // ===================================
  //  EFFECT: TX STATUS LISTENER
  // ===================================

  useEffect(() => {
    // ❗ TODO: [ tx ] button next to log with block info
    if (txStatus === "success") {
      const res = { ok: true, data: null }; // its sloppy, but works for now

      if (activeTx === "color" && activeTokenId !== null) {
        updateSVG(activeTokenId);
        handleResult(res, "color", `Token #${activeTokenId}`);
      }

      if (activeTx === "mint") {
        const newId = BigInt(mintTx.logs[0].data);
        const to = (mintTx.logs[0].args as { to: string }).to;

        const newNFT = async () => {
          const newIndex = await addNewNFT(newId);
          setIndexActiveNFT(newIndex);
        };
        newNFT();

        handleResult(
          { ok: true, data: shortenAddr(to) },
          "mint",
          `Token #${newId.toString()}`,
        );
      }

      if (activeTx === "transfer" && activeTokenId !== null) {
        handleResult(res, "transfer", `Token #${activeTokenId}`);
      }
    }

    // ❗ TODO: show revert popup onclick (like a see more)
    if (txStatus === "reverted") {
      pushLog({ type: "error", message: "❌ Transaction failed" });
    }
  }, [txStatus]);

  // ===================================
  //  JSX RETURN
  // ===================================

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        {/* Actinon Buttons */}
        <div className="flex flex-row items-center gap-3 ">
          {Object.entries(UI_ACTIONS)
            .filter(([_, action]) => action.topBar)
            .map(([key, action]) => {
              const Icon = action?.icon;

              return (
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
                  {Icon && <Icon className="w-4 h-4" />}
                  {action.button}
                </button>
              );
            })}
        </div>

        {/* NFT Panel */}
        <div className="w-80 h-76 flex justify-center border border-default rounded-lg">
          {isGalleryLoading ? (
            <div className="flex items-center">
              <LoadingSpinner size={44} />
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
            <p className="text-muted text-center mt-2">No actions yet...</p>
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
            <li>Custom Errors</li>
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
        <div className="border-t border-b border-default text-accent my-8 px-2 py-4 space-y-1">
          <p className="flex items-center gap-2">
            <CircleAlert className="w-4 h-4" />
            <strong>NB:</strong>
            MiniNFT is an NFT, but it does not comply with the ERC721 standard.
          </p>

          <p className="pl-6 text-accent/80">
            Minis will not display in any wallet.
          </p>
        </div>
      </div>

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
