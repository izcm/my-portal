import { useState } from "react";

const nftOptions = [
  { label: "ICE", src: "/icons/tmp/ICE.svg" },
  { label: "EMERALD", src: "/icons/tmp/EMERALD.svg" },
  { label: "COPPER", src: "/icons/tmp/COPPER.svg" },
];

export const MintNFTDisplay = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % nftOptions.length);
  const prev = () =>
    setIndex((i) => (i - 1 + nftOptions.length) % nftOptions.length);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Image Panel */}
      <div
        className="
          w-48 h-48 flex items-center justify-center
          bg-secondary border border-default rounded-lg
          overflow-hidden
        "
      >
        <img
          key={nftOptions[index].src}
          src={nftOptions[index].src}
          alt={nftOptions[index].label}
          className="w-full h-full object-contain fade-in"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 text-muted select-none">
        <span
          onClick={prev}
          className="
            cursor-pointer text-lg 
            transition-colors duration-150
            hover:text-accent
          "
        >
          ‹
        </span>

        <span className="text-xs tracking-widest uppercase font-mono w-24 text-center">
          {nftOptions[index].label}
        </span>

        <span
          onClick={next}
          className="
            cursor-pointer text-lg 
            transition-colors duration-150
            hover:text-accent
          "
        >
          ›
        </span>
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {nftOptions.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`
        w-2.5 h-2.5 rounded-full cursor-pointer transition-all
        ${i === index ? "bg-accent" : "bg-muted border border-soft"}
      `}
          />
        ))}
      </div>
    </div>
  );
};
