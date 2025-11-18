import { useReadContract } from "wagmi";
import { readContract } from "wagmi/actions";

// local
import { wagmiConfig } from "../config";
import { mini721ContractConfig as miniConfig } from "./abi";

const svgToBase64 = (svg: string): string =>
  `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

export const readTotalSupply = async () => {
  try {
    const totalSupply = await readContract(wagmiConfig, {
      ...miniConfig,
      functionName: "totalSupply",
    } as any);

    return totalSupply;
  } catch (err) {
    console.error("❌ Failed to read SVG:", err);
    return null;
  }
};
export const readSVG = async (tokenId: bigint) => {
  try {
    const svgRaw = await readContract(wagmiConfig, {
      ...miniConfig,
      functionName: "svg",
      args: [tokenId],
    } as any); // typescript complains about auth list

    if (typeof svgRaw !== "string") return null;

    // encode to Base64
    return svgToBase64(svgRaw);
  } catch (err) {
    console.error("❌ Failed to read SVG:", err);
    return null;
  }
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
  try {
    const balance = await readContract(wagmiConfig, {
      ...miniConfig,
      functionName: "balanceOf",
      args: [address],
    } as any); // typescript complains about auth list

    return balance;
  } catch (err) {
    console.error("❌ Failed to read balance:", err);
    return null;
  }
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
