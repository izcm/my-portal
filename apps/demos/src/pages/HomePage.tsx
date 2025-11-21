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
    <div className="min-h-screen flex flex-col fade-in">
      <ConnectWallet />
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between h-16 px-6 border-b border-default">
        <span className="font-semibold text-lg glow">A2Z Blocks — Demos</span>
        <Link to="/" className="btn btn-ghost text-sm">
          Landing
        </Link>
      </nav>

      {/* DEMO LIST */}
      <main className="flex flex-col items-center py-12 grow">
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold glow mb-2">Available Demos</h1>
            <p className="text-muted">Choose a demo to explore Web3 development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-6">
            {demos.map((demo) => (
              <Link
                key={demo.id}
                to={`/${demo.id}`}
                className="
                  border border-default rounded-xl p-6 bg-black/10
                  hover:bg-black/20 hover:border-accent/40
                  transition-all duration-200
                  hover:-translate-y-1 hover:shadow-lg
                  backdrop-blur-sm
                "
              >
                <h2 className="text-lg font-semibold mb-2">{demo.title}</h2>
                <p className="text-muted text-sm leading-relaxed">{demo.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-xs text-muted text-center py-6">
        © 2025 A2Z Blocks — Humbly built.
      </footer>
    </div>
  );
};
