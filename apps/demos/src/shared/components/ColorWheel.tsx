import { useEffect, useRef, useState } from "react";

type Props = {
  onChange: (hex: string) => void;
  size?: number;
};

export const ColorWheel: React.FC<Props> = ({ onChange, size = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const markerRef = useRef<HTMLCanvasElement | null>(null);

  const radius = size / 2;

  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);

  /* -------------- draw the wheel once -------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius) {
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
          const sat = dist / radius;

          ctx.fillStyle = `hsl(${angle}, ${sat * 100}%, 50%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [size, radius]);

  /* -------------- draw the marker whenever it changes -------------- */
  useEffect(() => {
    const markerCanvas = markerRef.current;
    const wheelCanvas = canvasRef.current;
    if (!markerCanvas || !wheelCanvas) return;

    const ctx = markerCanvas.getContext("2d");
    if (!ctx) return;

    // clear previous marker
    ctx.clearRect(0, 0, size, size);

    if (!marker) return;

    // Outer ring with glow effect
    ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(marker.x, marker.y, 8, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.stroke();

    // Reset shadow for inner elements
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Inner ring
    ctx.beginPath();
    ctx.arc(marker.x, marker.y, 5, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(marker.x, marker.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fill();
  }, [marker, size]);

  /* -------------- click handler (same as yours + marker) -------------- */
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    // update marker dot
    setMarker({ x, y });

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
    <div
      className="relative transition-all duration-300 hover:scale-105"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full opacity-60"
        style={{
          background: `
            radial-gradient(
              circle at center,
              transparent 70%,
              color-mix(in oklab, var(--accent) 20%, transparent) 85%,
              color-mix(in oklab, var(--accent) 40%, transparent) 95%,
              transparent 100%
            )
          `,
          filter: 'blur(4px)',
        }}
      />
      
      {/* Main color wheel container */}
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          border: '1px solid color-mix(in oklab, var(--border-default) 80%, var(--accent) 20%)',
          boxShadow: `
            0 2px 8px rgba(109, 117, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
        }}
      >
        {/* actual color wheel */}
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          onClick={handleClick}
          className="cursor-crosshair transition-opacity duration-200 hover:opacity-90"
          style={{
            borderRadius: "50%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        {/* transparent canvas JUST for the marker */}
        <canvas
          ref={markerRef}
          width={size}
          height={size}
          style={{
            borderRadius: "50%",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none", // clicks pass through
          }}
        />
      </div>
    </div>
  );
};
