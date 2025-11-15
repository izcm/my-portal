import { useEffect, useRef } from "react";

type Props = {
  onChange: (hex: string) => void;
  size?: number;
};

export const ColorWheel: React.FC<Props> = ({ onChange, size = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // draw that cosmic wheel 💫
    const radius = size / 2;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius) {
          // angle 0..360
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
          const sat = dist / radius;

          ctx.fillStyle = `hsl(${angle}, ${sat * 100}%, 50%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [size]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex =
      "#" +
      [...pixel]
        .slice(0, 3)
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("");

    onChange(hex);
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      onClick={handleClick}
      style={{ cursor: "crosshair", borderRadius: "50%" }}
    />
  );
};
