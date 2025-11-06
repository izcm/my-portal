const contract = import.meta.env.VITE_CONTRACT_ADDR;

export const mini721ContractConfig = {
  address: contract,
  abi: [
    {
      type: "function",
      name: "svg",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "svgData", type: "string" }],
    },
    {
      type: "function",
      name: "totalSupply",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "supply", type: "uint256" }],
    },
    {
      type: "function",
      name: "mint",
      stateMutability: "nonpayable",
      inputs: [{ name: "to", type: "address" }],
      outputs: [],
    },
  ],
} as const;
