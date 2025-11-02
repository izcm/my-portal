import blockSvg from "@/assets/icons/blocks.svg";
import { DemoCard } from "./components/organisms/DemoCard";

const demos = [
  {
    id: "royalty-nft",
    img: "nft",
    title: "YUL Mini721",
    desc: "Minimal NFT in pure yul.",
  },
  {
    id: "swap-ui",
    img: "architecture",
    title: "On-Chain Ecosystem",
    desc: "Get your testnet adapter today.",
  },
  {
    id: "onchain-voting",
    img: "nft",
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
              Contact
            </a>
          </div>
        </nav>
        <div className="h-[2px] w-full bg-seperator"></div>
      </div>

      {/* HERO */}
      <div className="flex flex-col grow">
        <section className="flex justify-center section--cosmic fade-in">
          <div
            className=" 
              flex flex-col lg:flex-row grow min-h-[640px] 
              items-center justify-center px-4 py-4
              max-w-4xl
            "
          >
            <div className="lg:w-1/2">
              <h1 className="hero-title glow py-2">A2Z Blocks</h1>
              <p className="hero-kicker">End-to-end Web3 development.</p>
              <p className="hero-kicker">From blueprint to bytecode.</p>
              <button className="btn btn-primary mt-6">View Live Demos</button>
            </div>

            <div className="lg:w-1/2 text-center relative">
              {/* BACKLIGHT BEHIND SVG */}
              <div
                className="
                pointer-events-none absolute right-[10%] top-1/2 -translate-y-1/2
                w-[480px] h-[480px] rounded-full opacity-[0.55]
                bg-[radial-gradient(circle,rgba(60,90,180,0.28),transparent_75%)]
                blur-[110px]
              "
              />
              <img
                src={blockSvg}
                alt="block visual"
                className="w-86 inline-block relative z-10"
              />
            </div>
          </div>
        </section>

        <div className="h-[2px] w-full bg-seperator" />

        {/* DEMOS */}
        <section className="flex flex-col mx-auto max-w-7xl p-10 fade-in">
          <h2 className="hero-kicker mb-4">Demos</h2>
          <div
            className="
                grid grid-cols-1 md:grid-cols-3 gap-4
                border border-subtle rounded-xl p-6
                bg-black/20 backdrop-blur-sm
              "
          >
            {demos.map((demo) => (
              <DemoCard key={demo.id} {...demo} />
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer
        className="
          flex flex-col items-center justify-center h-16 gap-1
          border-t border-neutral-800 text-xs text-neutral-500
        "
      >
        <p>© 2025 A2Z Blocks. All rights reserved.</p>
        <p>Humbly built. Rigorously optimized.</p>
      </footer>
    </div>
  );
}
