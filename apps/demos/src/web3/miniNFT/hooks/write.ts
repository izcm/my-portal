import { mini721ContractConfig as miniConfig } from "../abi";
import { useTx } from "../../helpers/useTx";

export const useMint = (caller: string) => {
  const tx = useTx(miniConfig.abi);
  const mint = (to: `0x${string}`, color: bigint) => {
    tx.send({
      ...miniConfig,
      functionName: "mintWithColor",
      args: [to, color],
      account: caller,
    });
  };
  return { ...tx, mint };
};

export const useTransfer = (caller: string) => {
  const tx = useTx(miniConfig.abi);
  const transfer = (to: `0x${string}`, tokenId: bigint) => {
    tx.send({
      ...miniConfig,
      functionName: "transfer",
      args: [to, tokenId],
      account: caller,
    });
  };
  return { ...tx, transfer };
};

export const useSetColor = (caller: string) => {
  const tx = useTx(miniConfig.abi);
  const setColor = (tokenId: bigint, rgb: bigint) => {
    tx.send({
      ...miniConfig,
      functionName: "setColor",
      args: [tokenId, rgb],
      account: caller,
    });
  };
  return { ...tx, setColor };
};
