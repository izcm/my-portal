import "./App.css";
import blockSvg from "@/assets/block.svg";
// import { Home } from "./pages/Home.tsx";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* NAVBAR */}
      <div>
        <nav
          className="
        flex items-center justify-between 
        h-16 px-6 
        border-b border-neutral-800
        "
        >
          <span className="font-bold text-lg">A2Z Blocks</span>
          <div className="flex gap-6 text-sm">
            <a href="#">About</a>
            <a href="#">Solutions</a>
            <a href="#">Contact</a>
          </div>
        </nav>
        <div className="h-[2px] w-full bg-blue-500 animate-pulse"></div>
      </div>

      <div className="flex flex-col grow gap-4">
        <section
          className="
            flex flex-col lg:flex-row grow min-h-[720px] 
            items-center gap-4 px-4 py-4"
        >
          <div className="lg:w-2/5 px-4 py-4">
            <h1 className=""> A2Z Blocks</h1>
            <p>From blueprint to bytecode.</p>
          </div>
          <div className="lg:w-3/5 text-center">
            <img
              src={blockSvg}
              alt="block visual"
              className="w-86 inline-block w-86"
            />
          </div>
        </section>
        <div className="h-[2px] w-full bg-blue-500 animate-pulse"></div>
        <section>
          <h2>Demos</h2>
          <div className="h-80 bg-blue-500">01</div>
        </section>
      </div>

      {/* FOOTER */}
      <footer
        className="
      flex items-center justify-center h-14 
      border-t border-neutral-800 text-xs text-neutral-500"
      >
        © 2025 BITBLCOKS. All rights reserved.
      </footer>
    </div>
  );
}
