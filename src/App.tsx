import "./App.css";
import blockSvg from "@/assets/block.svg";

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
        <div className="h-[2px] w-full bg-blue-500 animate-pulse"></div>
      </div>

      {/* HERO */}
      <div className="flex flex-col grow">
        <section
          className="flex justify-center section--cosmic fade-in"
        >
          <div
            className=" 
            flex flex-col lg:flex-row grow min-h-[720px] 
            items-center justify-evenly px-4 py-4
            max-w-4xl
            "
          >
            <div className="lg:w-1/2">
              <h1 className="hero-title glow">A2Z Blocks</h1>
              <p className="hero-kicker">From blueprint to bytecode.</p>
              <button className='btn btn-primary mt-6'>Check Demos</button>
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

        <div className="h-[2px] w-full bg-blue-500 animate-pulse"></div>

        {/* DEMOS */}
        <section className="flex flex-col px-4 py-10 fade-in">
          <h2 className="hero-kicker mb-2">Demos</h2>
          <div className="h-80 flex items-center justify-center border border-neutral-800 rounded-xl">
            slideshow
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer
        className="
        flex items-center justify-center h-14 
        border-t border-neutral-800 text-xs text-neutral-500
      "
      >
        © 2025 BITBLCOKS. All rights reserved.
      </footer>
    </div>
  );
}
