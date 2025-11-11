import { useReadContract } from "wagmi";
import { readContract } from "wagmi/actions";

// local
import { wagmiConfig as config } from "../config";
import { mini721ContractConfig } from "../contracts";

const svgToBase64 = (svg: string): string =>
  `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

export const useTotalSupply = () => {
  const {
    data: totalSupply,
    isPending,
    error,
    refetch,
  } = useReadContract({
    ...mini721ContractConfig,
    functionName: "totalSupply",
    query: {
      enabled: false,
    },
  });

  const readTotalSupply = async () => {
    const result = await refetch();
    return result;
  };

  return {
    readTotalSupply,
    totalSupply,
    isPending,
    error,
  };
};

export const readSVG = async (tokenId: bigint) => {
  try {
    const svgRaw = await readContract(config, {
      ...mini721ContractConfig,
      functionName: "svg",
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
    const owner = await readContract(config, {
      ...mini721ContractConfig,
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
    const balance = await readContract(config, {
      ...mini721ContractConfig,
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
  const supply = await readContract(config, {
    ...mini721ContractConfig,
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
