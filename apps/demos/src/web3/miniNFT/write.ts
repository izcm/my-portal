import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { mini721ContractConfig } from "./abi";

export const useMint = (sender: string) => {
  const {
    data: txHash,
    writeContract,
    status: writeStatus,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const mint = (to: `0x${string}`, color: bigint) =>
    writeContract({
      ...mini721ContractConfig,
      functionName: "mintWithColor",
      args: [to, color],
      account: sender,
    });

  return {
    mint,
    txHash,
    writeStatus, // pending wallet confirm
    isConfirming, // waiting for mining
    isSuccess, // mined
    isError, // reverted
  };
};
