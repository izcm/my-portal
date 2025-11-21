import { readContract } from "wagmi/actions";

// local
import { wagmiConfig } from "../../../../shared/web3/config";
import { mini721ContractConfig as miniConfig } from "../abi";
import { safeRead } from "../../../../shared/web3/helpers/safeRead";

const svgToBase64 = (svg: string): string =>
  `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

export const readTotalSupply = async () => {
  return safeRead("Total Supply", () =>
    readContract(wagmiConfig, {
      ...miniConfig,
      functionName: "totalSupply",
    } as any),
  );
};

export const readSVG = async (tokenId: bigint) => {
  return safeRead("SVG", async () => {
    const raw = await readContract(wagmiConfig, {
      ...miniConfig,
      functionName: "svg",
      args: [tokenId],
    } as any);

    if (typeof raw !== "string") {
      throw new Error("Invalid SVG Format");
    }

    return svgToBase64(raw);
  });
};

export const readOwnerOf_ = async (tokenId: bigint) => {
  return safeRead("Owner", async () => {
    const owner = await readContract(wagmiConfig, {
      ...miniConfig,
      functionName: "ownerOf",
      args: [tokenId],
    } as any);

    return owner as `0x${string}`;
  });
};

export const readOwnerOf = async (tokenId: bigint) => {
  try {
    const owner = await readContract(wagmiConfig, {
      ...miniConfig,
      functionName: "ownerOf",
      args: [tokenId],
    } as any); // typescript complains about auth list

    return owner as `0x${string}`;
  } catch (err) {
    console.error("❌ Failed to read ownerOf:", err);
    return null;
  }
};

export const readBalanceOf = async (address: string) => {
  return safeRead("Balance", () => {
    return readContract(wagmiConfig, {
      ...miniConfig,
      functionName: "balanceOf",
      args: [address],
    } as any);
  });
};

export const fetchMyTokens = async (address: `0x${string}`) => {
  const supply = await readContract(wagmiConfig, {
    ...miniConfig,
    functionName: "totalSupply",
  } as any); // as any to skip auth list

  const total = Number(supply || 0);
  const myTokens: bigint[] = [];

  for (let i = 1; i <= total; i++) {
    try {
      const owner = await readOwnerOf(BigInt(i));
      if (owner?.toLowerCase() === address.toLowerCase()) {
        myTokens.push(BigInt(i));
      }
    } catch (err) {
      console.warn(`❌ failed reading token ${i}`, err);
    }
  }

  return myTokens;
};
