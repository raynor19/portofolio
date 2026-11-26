import React, { useEffect, useRef } from 'react';

/**
 * TopographyCanvas
 * Latar belakang garis kontur topografi prosedural organik.
 * Dirender sekali ke dalam canvas beresolusi tinggi saat dimuat dan saat ukuran layar berubah,
 * menghasilkan performa rendering super mulus (0% CPU/GPU saat scroll).
 */
export default function TopographyCanvas({
  theme = 'light', // 'light' | 'dark'
  opacity = 0.55,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const strokeColor = theme === 'dark' ? 'rgba(148, 163, 184, 0.22)' : 'rgba(148, 163, 184, 0.42)';
    const majorColor = theme === 'dark' ? 'rgba(203, 213, 225, 0.42)' : 'rgba(100, 116, 139, 0.62)';
    const rings = 14;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.45;
      const maxRadius = Math.hypot(width, height) * 0.75;

      for (let r = 0; r < rings; r++) {
        const baseRadius = (r + 1) * (maxRadius / rings);
        const isMajor = r % 4 === 0;

        ctx.beginPath();
        const segments = 64;
        for (let s = 0; s <= segments; s++) {
          const angle = (s / segments) * Math.PI * 2;

          // Variasi harmonik multi-frekuensi untuk bentuk topografi alam organik
          const wave1 = Math.sin(angle * 3 + r * 0.4) * 28;
          const wave2 = Math.cos(angle * 5 + r * 0.2) * 16;
          const wave3 = Math.sin(angle * 2 + 1.2) * 20;

          const rad = baseRadius + wave1 + wave2 + wave3;
          const x = centerX + Math.cos(angle) * rad;
          const y = centerY + Math.sin(angle) * rad * 0.75;

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        ctx.strokeStyle = isMajor ? majorColor : strokeColor;
        ctx.lineWidth = isMajor ? 1.5 : 0.85;
        ctx.stroke();
      }
    };

    draw();

    let resizeTimer = null;
    const onResize = () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
}
