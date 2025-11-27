import { MiniNFTDemo } from "../../features/miniNFT/Demo";

export const demos = [
  {
    id: "miniNFT",
    img: "nft",
    title: "YUL MiniNFT",
    desc: "Minimal NFT in pure Yul assembly.",
    repo: "yul-miniNFT",
    contract: "0x520a8d21e74f762a285fcd6cdea842474408d166",
    demo: MiniNFTDemo,
  },
  {
    id: "swap-ui",
    img: "architecture",
    title: "On-Chain Ecosystem",
    desc: "Get your testnet adapter today.",
    repo: "",
    contract: "",
    demo: MiniNFTDemo,
  },
  {
    id: "onchain-voting",
    img: "nft",
    title: "On-Chain Voting",
    desc: "Lightweight DAO governance example.",
    repo: "",
    contract: "",
    demo: MiniNFTDemo,
  },
] as const;
