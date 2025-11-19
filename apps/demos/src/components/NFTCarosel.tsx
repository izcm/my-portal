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

  const maxDots = 4;

  // Determine the current "page" based on index
  const page = Math.floor(index / maxDots);

  const startIndex = page * maxDots;
  const endIndex = Math.min(startIndex + maxDots, items.length);

  const dots = items.slice(startIndex, endIndex);

  const itemsBefore = startIndex;
  const itemsAfter = items.length - endIndex;

  return (
    <div className="flex flex-col items-center gap-2">

      {/* Image Panel */}
      <div className="w-42 h-42 flex items-center justify-center overflow-hidden">
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
          className="cursor-pointer text-lg hover:text-accent transition-colors duration-150"
        >
          ‹
        </span>

        <span className="text-xs tracking-widest uppercase font-mono w-24 text-center">
          {nft.label}
        </span>

        <span
          onClick={next}
          className="cursor-pointer text-lg hover:text-accent transition-colors duration-150"
        >
          ›
        </span>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2">

        {/* +before */}
        {itemsBefore > 0 && (
          <span className="text-xs text-muted font-mono">+{itemsBefore}</span>
        )}

        {dots.map((_, i) => {
          const realIndex = startIndex + i;
          return (
            <div
              key={realIndex}
              onClick={() => onChange(realIndex)}
              className={`
                w-2.5 h-2.5 rounded-full cursor-pointer transition-all
                ${
                  realIndex === index
                    ? "bg-accent"
                    : "bg-muted border border-soft"
                }
              `}
            />
          );
        })}

        {/* +after */}
        {itemsAfter > 0 && (
          <span className="text-xs text-muted font-mono">+{itemsAfter}</span>
        )}

      </div>

    </div>
  );
};
