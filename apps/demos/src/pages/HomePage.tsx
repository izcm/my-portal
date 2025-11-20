import { Link } from "react-router-dom";
import { demos } from "../shared/data/demos";

import { Account } from "../shared/web3/wallet/account";
import { WalletOptions } from "../shared/web3/wallet/wallet-options";
import { useAccount } from "wagmi";

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

export const HomePage = () => {
  return (
    <div className="flex flex-col">
      <ConnectWallet />
      {/* NAVBAR */}
      <nav className="navbar flex items-center justify-between h-16 px-4 border-b border-default">
        <span className="font-bold text-lg">A2Z Blocks — Demos</span>
        <div className="flex gap-6 text-sm">
          <Link to="/" className="ink">
            Landing
          </Link>
        </div>
      </nav>

      {/* DEMO LIST */}
      <main className="flex flex-col grow items-center py-10">
        <h1 className="text-3xl font-semibold mb-6 glow">Available Demos</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl p-4">
          {demos.map((demo) => (
            <Link
              key={demo.id}
              to={`/${demo.id}`}
              className="border border-default rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold">{demo.title}</h2>
              <p className="text-dim text-sm mt-1">{demo.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};
