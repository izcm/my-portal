import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

export const useTx = () => {
  const [status, setStatus] = useState<
    "idle" | "wallet" | "sent" | "mining" | "success" | "reverted"
  >("idle");

  const { writeContract, data: hash, status: writeStatus } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  // wallet confirm
  useEffect(() => {
    if (writeStatus === "pending") setStatus("wallet");
    if (writeStatus === "success") setStatus("sent");
    if (writeStatus === "error") setStatus("reverted");
  }, [writeStatus]);

  // blockchain mining
  useEffect(() => {
    if (!hash) return;
    if (receipt.isLoading) setStatus("mining");
    if (receipt.isSuccess) setStatus("success");
    if (receipt.isError) setStatus("reverted");
  }, [hash, receipt.isLoading, receipt.isSuccess, receipt.isError]);

  const send = (config: any) => writeContract(config);

  return { status, hash, send };
};
