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

    ctx.beginPath();
    ctx.arc(marker.x, marker.y, 6, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(marker.x, marker.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "white";
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
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      {/* actual color wheel */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onClick={handleClick}
        style={{
          borderRadius: "50%",
          cursor: "crosshair",
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
  );
};
