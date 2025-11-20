export const makeActionConfig = () =>
  ({
    mint: {
      title: "Mint to which address?",
      placeholder: "",
      button: "⛏ Mint New",
      confirm: "Mint",
      topBar: true,
      modal: true,
    },

    transfer: {
      title: "Transfer to what address?",
      placeholder: "0xabc123",
      button: "Transfer",
      confirm: "Execute Transfer",
      topBar: false,
      modal: true,
    },

    color: {
      title: "Set NFT Color",
      placeholder: "",
      button: "Change NFT Color",
      confirm: "Set Color",
      topBar: false,
      modal: true,
    },

    totalSupply: {
      title: "Mint to which address?",
      placeholder: "address",
      button: "📊 Supply",
      confirm: "Read Supply",
      topBar: true,
      modal: false,
    },

    ownerOf: {
      title: "Owner of which token?",
      placeholder: "tokenId",
      button: "🔍 Owner",
      confirm: "Read Owner",
      topBar: true,
      modal: true,
    },

    balanceOf: {
      title: "Balance of which address?",
      placeholder: "0xabc123",
      button: "🔢 Balances",
      confirm: "Read Balance",
      topBar: true,
      modal: true,
    },
  }) as const;
