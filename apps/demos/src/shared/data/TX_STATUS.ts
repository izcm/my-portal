export type TxStatus =
  | "idle"
  | "wallet"
  | "sent"
  | "mining"
  | "success"
  | "reverted";

const TX_STATUS_MESSAGES: Record<TxStatus, string> = {
  idle: "",
  wallet: "🔐 Waiting for wallet...",
  sent: "🚀 Transaction sent...",
  mining: "⛏ Mining on chain...",
  success: "✅ Success!",
  reverted: "❌ Transaction failed",
};

export const getTxMessage = (status: TxStatus | null): string => {
  if (!status) return "";
  return TX_STATUS_MESSAGES[status] || "";
};
