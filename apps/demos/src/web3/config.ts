import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { anvil, sepolia } from "wagmi/chains";

// const projectId = "e75c267ad227e3464c860e9125938f2c";

export const config = createConfig({
  chains: [{ ...anvil, testnet: true }, sepolia],
  transports: {
    [anvil.id]: http(), // uses RPC from chain definition → 127.0.0.1:8545
    [sepolia.id]: http(), // default public RPC
  },
  connectors: [injected()],
});
