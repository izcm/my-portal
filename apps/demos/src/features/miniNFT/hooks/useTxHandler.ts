import { useState } from "react";

// local
import { useMint, useSetColor, useTransfer } from "../web3/hooks/write";
import { getTxMessage } from "../../../shared/data/TX_STATUS";

export type WriteActionKey = "mint" | "color" | "transfer";
export const WRITE_KEYS = ["mint", "color", "transfer"] as const;

export const isWriteKey = (key: string): key is WriteActionKey =>
  (WRITE_KEYS as readonly string[]).includes(key);

export const useTxHandler = (wallet: `0x${string}`) => {
  const mintTx = useMint(wallet);
  const transferTx = useTransfer(wallet);
  const setColorTx = useSetColor(wallet);

  const [activeTx, setActiveTx] = useState<WriteActionKey | null>(null);

  // Derive current tx status based on active transaction
  const txStatus =
    activeTx === "mint"
      ? mintTx.status
      : activeTx === "color"
        ? setColorTx.status
        : activeTx === "transfer"
          ? transferTx.status
          : null;

  // user-friendly messages for current status
  const txMessage = getTxMessage(txStatus);

  return {
    mintTx,
    transferTx,
    setColorTx,
    activeTx,
    setActiveTx,
    txStatus,
    txMessage,
  };
};
