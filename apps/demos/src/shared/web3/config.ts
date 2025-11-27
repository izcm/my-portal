import { createConfig, http } from "wagmi";
//import { injected } from "wagmi/connectors";
import { anvil } from "wagmi/chains";
import { sepolia } from "wagmi/chains";

// const projectId = "";

export const wagmiConfig = createConfig({
  chains: [
    { ...anvil, testnet: true },
    { ...sepolia, testnet: true },
  ],
  transports: {
    [anvil.id]: http(), // uses RPC from chain definition → 127.0.0.1:8545
    [sepolia.id]: http(), // uses RPC from chain definition
  },
  //connectors: [injected()],
});
