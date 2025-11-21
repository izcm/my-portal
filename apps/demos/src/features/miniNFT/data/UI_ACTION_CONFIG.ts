import {
  Pickaxe,
  ChartArea,
  UserSearch,
  WalletMinimal,
  Repeat,
  Paintbrush,
} from "lucide-react";

type Action = {
  title: string;
  placeholder: string;
  button: string;
  confirm: string;
  topBar: boolean;
  modal: boolean;
  icon?: React.ComponentType<any>; // <-- optional icon
};

export const makeActionConfig = () =>
  ({
    mint: {
      title: "Mint to which address?",
      placeholder: "",
      button: "Mint New",
      icon: Pickaxe,
      confirm: "Mint",
      topBar: true,
      modal: true,
    },

    transfer: {
      title: "Transfer to what address?",
      placeholder: "0xabc123",
      icon: Repeat,
      button: "Transfer",
      confirm: "Execute Transfer",
      topBar: false,
      modal: true,
    },

    color: {
      title: "Set NFT Color",
      placeholder: "",
      button: "Change NFT Color",
      icon: Paintbrush,
      confirm: "Set Color",
      topBar: false,
      modal: true,
    },

    totalSupply: {
      title: "Mint to which address?",
      placeholder: "address",
      button: "Supply",
      icon: ChartArea,
      confirm: "Read Supply",
      topBar: true,
      modal: false,
    },

    ownerOf: {
      title: "Owner of which token?",
      placeholder: "tokenId",
      icon: UserSearch,
      button: "Owner",
      confirm: "Read Owner",
      topBar: true,
      modal: true,
    },

    balanceOf: {
      title: "Balance of which address?",
      placeholder: "0xabc123",
      icon: WalletMinimal,
      button: "Balances",
      confirm: "Read Balance",
      topBar: true,
      modal: true,
    },
  }) as Record<string, Action>;
