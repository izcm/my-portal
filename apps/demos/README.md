# A2Z Blocks — Demos

This project is part of the **A2Z Blocks** learning suite, focused on mastering the **EVM from first principles** while building real, interactive demos.

## **MiniNFT — Yul-Powered Minimal NFT Demo**

A compact, educational NFT implementation built entirely in **Yul**.

### **🌐 Live Demo**

_(Add your demo URL here when deployed)_

---

### **📦 Features**

#### **Smart Contract (Yul)**

- Minimal NFT implementation (not ERC-721 compliant)
- Custom **bitpacked** storage:
  - `totalSupply` packed with flags
  - Address suffix authority bits
  - 2-bit `emotionalState` encoding

- Raw SVG output stored fully on-chain
- `mint()`, `transfer()`, `setColor()`, and `svg()` functions
- Realistic vs simplified mapping styles (linear + keccak)

#### **Frontend (React + Wagmi + Viem)**

- Wallet connect flow
- Full NFT gallery for the connected wallet
- On-chain SVG rendering via Base64
- Carousel viewer for token navigation
- Modal-driven actions:
  - Mint
  - Transfer
  - Change color
  - Read actions (`totalSupply`, `ownerOf`, `balanceOf`)

- Action log with success/error feedback
- Clean, atomic layout using Tailwind

---

### **🧪 Tech Stack**

| Layer              | Tools                               |
| ------------------ | ----------------------------------- |
| **Smart Contract** | Yul, Foundry (deployment), ABI JSON |
| **Frontend**       | React, TypeScript, Wagmi, Viem      |
| **Styling**        | Tailwind, custom tokens             |
| **Build**          | Vite                                |

---

### **⚠️ Disclaimer**

This project is **not** ERC-721 compliant.
It is intentionally simplified to make EVM mechanisms visible:

- No interfaces
- No safe transfers
- No metadata standard
- No marketplace compatibility

MiniNFT tokens **will not show up in wallets** — by design.

---

### **🚀 Running the Project**

#### Install dependencies

```bash
npm install
```

#### Start the frontend

```bash
npm run dev
```

#### Build for production

```bash
npm run build
```

Make sure your `.env` contains your Wagmi/Viem RPC config.

---

### **🧩 Read Actions (UI Layer)**

All read calls are wrapped using a small helper (`handleResult`) to unify error and success output in the UI action log.

Supported reads:

- `totalSupply()`
- `ownerOf(tokenId)`
- `balanceOf(address)`

---

### **🎨 About the Demo**

MiniNFT exists to teach:

- low-level EVM storage access
- calldata ABI decoding
- events
- reading/writing mappings by hand
- Base64 encoded SVG return values
- front-end ↔ smart contract integration

It’s intentionally minimalistic and perfect for experimenting or extending.

---
