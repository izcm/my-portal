import "./styles/demo-card.css";

type DemoCardProps = {
  title: string;
  desc: string;
  id: string;
  img: string;
};

export function DemoCard({ title, desc, id, img }: DemoCardProps) {
  return (
    <div
      className="
        demo-card group
        relative flex flex-col items-center
        p-6 rounded-xl
        bg-[rgba(5,7,16,0.7)]
        border border-[rgba(120,130,255,0.14)]
        shadow-[0_0_18px_rgba(0,0,0,0.25)]
        backdrop-blur-2xl
        cursor-pointer
        transition-all
      "
    >
      <div className="demo-card__tag">demo •</div>
      <div className="demo-card__backlight" />

      <img
        src={`icons/${img}.svg`}
        alt={title}
        className="demo-card__icon w-40 h-40 object-contain mb-4 mt-2"
      />

      <h3 className="text-white font-semibold text-lg tracking-tight mb-1">
        {title}
      </h3>

      <p className="text-neutral-400 text-sm text-center leading-relaxed mb-4">
        {desc}
      </p>

      <button className="btn btn-primary demo-card__btn text-sm px-4 py-2 rounded-lg">
        View Demo →
      </button>
    </div>
  );
}
