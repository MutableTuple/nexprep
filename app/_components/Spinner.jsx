import { useEffect, useRef } from "react";

export function Spinner({ size = 32, color = [0, 0, 0] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const spokes = 12;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const innerR = size * 0.22;
    const outerR = size * 0.44;
    const lineW = size * 0.09;
    let frame = 0;

    const id = setInterval(() => {
      ctx.clearRect(0, 0, size, size);
      for (let i = 0; i < spokes; i++) {
        const angle = ((2 * Math.PI) / spokes) * i - Math.PI / 2;
        const alpha = 0.15 + (((spokes - i + frame) % spokes) / spokes) * 0.75;
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = lineW;
        ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
        ctx.moveTo(
          cx + Math.cos(angle) * innerR,
          cx + Math.sin(angle) * innerR,
        );
        ctx.lineTo(
          cx + Math.cos(angle) * outerR,
          cx + Math.sin(angle) * outerR,
        );
        ctx.stroke();
      }
      frame = (frame + 1) % spokes;
    }, 1000 / 12);

    return () => clearInterval(id);
  }, [size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size }} />;
}
