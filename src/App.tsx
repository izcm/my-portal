import "./App.css";
import { Home } from "./pages/Home.tsx";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* NAVBAR */}
      <div>
        <nav className="h-16 px-6 flex items-center justify-between border-b border-neutral-800">
          <span className="font-bold text-lg">BitBlocks</span>
          <div className="flex gap-6 text-sm">
            <a href="#">About</a>
            <a href="#">Solutions</a>
            <a href="#">Contact</a>
          </div>
        </nav>
        <div className="h-[2px] w-full bg-blue-500 animate-pulse"></div>
      </div>

      <section className="flex items-center h-dvh justify-center">
        <Home />
      </section>

      {/* FOOTER */}
      <footer className="h-14 flex items-center justify-center border-t border-neutral-800 text-xs text-neutral-500">
        © 2025 BITBLCOKS. All rights reserved.
      </footer>
    </div>
  );
}
