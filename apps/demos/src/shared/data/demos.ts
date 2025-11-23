import { MiniNFTDemo } from "../../features/miniNFT/Demo";

export const demos = [
  {
    id: "miniNFT",
    img: "nft",
    title: "YUL MiniNFT",
    desc: "Minimal NFT in pure Yul assembly.",
    demo: MiniNFTDemo,
  },
  {
    id: "swap-ui",
    img: "architecture",
    title: "On-Chain Ecosystem",
    desc: "Get your testnet adapter today.",
    demo: MiniNFTDemo,
  },
  {
    id: "onchain-voting",
    img: "nft",
    title: "On-Chain Voting",
    desc: "Lightweight DAO governance example.",
    demo: MiniNFTDemo,
  },
] as const;
