import { mini721ContractConfig as config } from "./abi";
import { useTx } from "../helpers/useTx";

export const useMint = (caller: string) => {
  const tx = useTx();
  const mint = (to: `0x${string}`, color: bigint) => {
    tx.send({
      ...config,
      functionName: "mintWithColor",
      args: [to, color],
      account: caller,
    });
  };
  return { ...tx, mint };
};

export const useTransfer = (caller: string) => {
  const tx = useTx();
  const transfer = (to: `0x${string}`, tokenId: bigint) => {
    tx.send({
      ...config,
      functionName: "transfer",
      args: [to, tokenId],
      account: caller,
    });
  };
  return { ...tx, transfer };
};

export const setColor = (caller: string) => {
  const tx = useTx();
  const setColor = (tokenId: bigint, rgb: bigint) => {
    tx.send({
      ...config,
      functionName: "setColor",
      args: [tokenId, rgb],
      account: caller,
    });
  };
  return { ...tx, setColor };
};
