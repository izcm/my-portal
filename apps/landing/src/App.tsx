import blockSvg from "@/assets/icons/blocks.svg";
import { DemoCard } from "./components/DemoCard";

const demos = [
  {
    id: "miniNFT",
    img: "nft",
    title: "YUL MiniNFT",
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
    img: "dao",
    title: "On-Chain Voting",
    desc: "Lightweight DAO governance example.",
  },
] as const;

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <div>
        <nav
          className="
            navbar
            flex items-center justify-between 
            h-16 px-4 
            border-b border-default
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
      </div>

      <div className="flex flex-col grow ">
        {/* HERO */}
        <section className="flex justify-center section--cosmic fade-in border-b border-default bg-black/10">
          <div
            className=" 
              flex flex-col lg:flex-row grow min-h-[400px]
              items-center justify-center
              max-w-4xl mt-8 lg:mt-0
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
                  w-[420px] h-[420px] rounded-full
                  bg-accent-weak opacity-20
                  blur-[120px]
                "
              />

              <img
                src={blockSvg}
                alt="block visual"
                className="w-80 inline-block relative z-10"
              />
            </div>
          </div>
        </section>

        {/* DEMOS */}
        <section className="flex flex-col mx-auto max-w-4xl p-10 fade-in">
          <h2 className="hero-kicker mb-4">Demos</h2>
          <div
            className="
                grid grid-cols-1 md:grid-cols-3 gap-4
                border border-default rounded-xl p-6
                backdrop-blur-sm 
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
          border-t border-default text-xs text-neutral-500
        "
      >
        <p>© 2025 A2Z Blocks. All rights reserved.</p>
        <p>Humbly built. Rigorously optimized.</p>
      </footer>
    </div>
  );
}
