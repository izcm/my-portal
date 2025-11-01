import blockSvg from "@/assets/block.svg";

export const Home = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between grow gap-4 max-w-7xl">
      {/* Left Text */}
      <div className="flex-3 text-start px-8">
        <h1 className="text-4xl font-bold mb-4">BitBlocks</h1>
        <p className="text-neutral-400 mb-6">
          Built different, deployed better.
        </p>
        <button className="px-5 py-2 rounded-md text-sm hover:bg-blue-700 transition">
          Check Demos
        </button>
      </div>

      {/* Right Visual (placeholder) */}
      <div className="flex flex-2 items-center justify-center">
        <img src={blockSvg} alt="block visual" className="w-64" />
      </div>
    </div>
  );
};
