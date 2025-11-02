import "./App.css";
import blockSvg from "@/assets/icons/blocks.svg";

const demos = [
  {
    id: "royalty-nft",
    title: "Royalty-Enforced NFT",
    desc: "On-chain marketplace enforcement demo.",
  },
  {
    id: "swap-ui",
    title: "Minimal Swap UI",
    desc: "Uniswap V2 contract interaction demo.",
  },
  {
    id: "onchain-voting",
    title: "On-Chain Voting",
    desc: "Lightweight DAO governance example.",
  },
] as const;

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* NAVBAR */}
      <div>
        <nav
          className="
            navbar
            flex items-center justify-between 
            h-16 px-4 
            border-b border-neutral-800
          "
        >
          <span className="font-bold text-lg hero-kicker">A2Z Blocks</span>
          <div className="flex gap-6 text-sm">
            <a href="#" className="ink">
              About
            </a>
            <a href="#" className="ink">
              Solutions
            </a>
            <a href="#" className="ink">
              Contact
            </a>
          </div>
        </nav>
        <div className="h-[2px] w-full bg-blue-900"></div>
      </div>

      {/* HERO */}
      <div className="flex flex-col grow">
        <section className="flex justify-center section--cosmic fade-in">
          <div
            className=" 
              flex flex-col lg:flex-row grow min-h-[720px] 
              items-center justify-center px-4 py-4
              max-w-4xl
            "
          >
            <div className="lg:w-1/2">
              <h1 className="hero-title glow py-2">A2Z Blocks</h1>
              <p className="hero-kicker">End-to-end Web3 development.</p>
              <p className="hero-kicker">From blueprint to bytecode.</p>
              <button className="btn btn-primary mt-6">Check Demos</button>
            </div>

            <div className="lg:w-1/2 text-center svg-neon">
              <img
                src={blockSvg}
                alt="block visual"
                className="w-86 inline-block"
              />
            </div>
          </div>
        </section>

        <div className="h-[2px] w-full bg-blue-900"></div>

        {/* DEMOS */}
        <section className="flex flex-col px-4 py-10 fade-in">
          <h2 className="hero-kicker mb-4">Demos</h2>

          <div
            className="
              grid grid-cols-1 md:grid-cols-3 gap-4 
              border border-neutral-800 rounded-xl p-6
              bg-black/20 backdrop-blur-sm
            "
          >
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="border border-neutral-800 rounded-lg p-4 flex flex-col justify-between bg-neutral-900/40"
              >
                <div>
                  <h3 className="text-lg font-semibold">{demo.title}</h3>
                  <p className="text-sm text-dim mt-1">{demo.desc}</p>
                </div>

                <button
                  className="btn btn-primary mt-4"
                  onClick={() => alert(`open modal for ${demo.id}`)}
                >
                  View Demo
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer
        className="
          flex flex-col items-center justify-center 8 h-16 gap-2
          border-t border-neutral-800 text-xs text-neutral-500
        "
      >
        <p>© 2025 A2Z Blocks. All rights reserved.</p>
        <p>Humbly built. Rigorously optimized.</p>
      </footer>
    </div>
  );
}
