import type { UI_NFT } from "../data/UI_NFT";

type NFTCarouselProps = {
  items: UI_NFT[];
  index: number;
  onChange: (i: number) => void;
};

export const NFTCarosel = ({ items, index, onChange }: NFTCarouselProps) => {
  const next = () => onChange((index + 1) % items.length);
  const prev = () => onChange((index - 1 + items.length) % items.length);

  const nft = items[index];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Image Panel */}
      <div
        className="
          w-42 h-42 flex items-center justify-center
          overflow-hidden
        "
      >
        <img
          key={nft.svg}
          src={nft.svg}
          alt={nft.label}
          className="h-full w-full object-contain fade-in"
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
          {items[index].label}
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
        {items.map((_, i) => (
          <div
            key={i}
            onClick={() => onChange(i)}
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
