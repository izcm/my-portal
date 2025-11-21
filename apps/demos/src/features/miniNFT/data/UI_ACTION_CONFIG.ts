import {
  Pickaxe,
  ChartArea,
  UserSearch,
  WalletMinimal,
  Repeat,
  Paintbrush,
} from "lucide-react";

type Action = {
  label: string;
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
      label: "Mint",
      title: "Mint to which address?",
      placeholder: "",
      button: "Mint New",
      confirm: "Mint",
      topBar: true,
      modal: true,
      icon: Pickaxe,
    },

    transfer: {
      label: "Transfer",
      title: "Transfer to what address?",
      placeholder: "0xabc123",
      button: "Transfer",
      confirm: "Execute Transfer",
      topBar: false,
      modal: true,
      icon: Repeat,
    },

    color: {
      label: "Set Color",
      title: "Set NFT Color",
      placeholder: "",
      button: "Change NFT Color",
      confirm: "Set Color",
      topBar: false,
      modal: true,
      icon: Paintbrush,
    },

    totalSupply: {
      label: "Total Supply",
      title: "Mint to which address?",
      placeholder: "address",
      button: "Supply",
      confirm: "Read Supply",
      topBar: true,
      modal: false,
      icon: ChartArea,
    },

    ownerOf: {
      label: "Owner Of",
      title: "Owner of which token?",
      placeholder: "tokenId",
      button: "Owner",
      confirm: "Read Owner",
      topBar: true,
      modal: true,
      icon: UserSearch,
    },

    balanceOf: {
      label: "Balance Of",
      title: "Balance of which address?",
      placeholder: "0xabc123",
      button: "Balances",
      confirm: "Read Balance",
      topBar: true,
      modal: true,
      icon: WalletMinimal,
    },
  }) as Record<string, Action>;
