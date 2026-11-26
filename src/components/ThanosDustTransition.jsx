import React, { useEffect, useRef } from 'react';

/**
 * ThanosDustTransition
 * Efek transisi debu jentikan Thanos saat beralih antara Dark Mode & Light Mode.
 *
 * Keunggulan:
 * 1. Canvas selalu terpasang di DOM (tidak pernah null / unmounted), menjamin 100% reliabilitas.
 * 2. Tidak menutupi teks, kartu, atau foto (hanya memancarkan partikel debu, serpihan abu, dan kilau energi).
 * 3. Tahan spam klik cepat (otomatis membersihkan frame sebelumnya dan mereset animasi).
 * 4. Efek tiupan angin kencang (wind sweep) dari kiri ke kanan dengan turbulensi melayang.
 * 5. Nol beban performa saat idle (canvas di-clear total).
 */
export default function ThanosDustTransition({
  isDark = false,
  duration = 1100, // ms
  className = '',
  zIndex = 30, // Tepat di atas background dan di bawah navbar/modal
}) {
  const canvasRef = useRef(null);
  const prevDarkRef = useRef(isDark);
  const isInitialMount = useRef(true);
  const animFrameRef = useRef(null);

  useEffect(() => {
    // Lewatkan saat pertama kali halaman dimuat (agar tidak memicu animasi instan)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevDarkRef.current = isDark;
      return;
    }

    // Jika status tema berubah
    if (prevDarkRef.current !== isDark) {
      const fromTheme = prevDarkRef.current ? 'dark' : 'light';
      prevDarkRef.current = isDark;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Batalkan animasi sebelumnya jika pengguna mengklik cepat berturut-turut
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Palet partikel debu berdasarkan mode yang ditinggalkan
      const colors = fromTheme === 'light'
        ? ['#ffffff', '#f4f4f5', '#e4e4e7', '#cbd5e1', '#94a3b8', '#64748b', '#60a5fa', '#38bdf8']
        : ['#09090b', '#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a', '#38bdf8', '#818cf8'];

      const glowColor = fromTheme === 'light' ? 'rgba(96, 165, 250, 0.75)' : 'rgba(56, 189, 248, 0.85)';

      const particles = [];
      const startTime = performance.now();

      // Fungsi pembuat partikel debu di sepanjang garis sapuan angin
      const spawnDustAt = (x, y) => {
        const count = 4 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
          particles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 16,
            vx: 4.5 + Math.random() * 7.5, // Tiupan angin kencang ke kanan
            vy: (Math.random() - 0.5) * 3 - (0.8 + Math.random() * 2.2), // Melayang ke atas seperti abu panas
            size: 1.4 + Math.random() * 3.4,
            alpha: 0.9 + Math.random() * 0.1,
            decay: 0.018 + Math.random() * 0.022,
            spin: (Math.random() - 0.5) * 0.28,
            angle: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            turb: 0.5 + Math.random() * 1.0,
          });
        }
      };

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        ctx.clearRect(0, 0, width, height);

        // Gelombang sapuan bergerak dari kiri (-80px) hingga melewati kanan (width + 180px)
        const waveProgress = Math.min(progress / 0.7, 1);
        const waveX = -80 + waveProgress * (width + 220);

        // 1. Gambar kilau energi gelombang sapuan (Thanos disintegration wave front)
        if (waveProgress < 1) {
          ctx.beginPath();
          const step = 24;
          const points = [];
          for (let y = 0; y <= height + step; y += step) {
            const noise = Math.sin(y * 0.02 + elapsed * 0.006) * 26 + Math.cos(y * 0.045) * 16;
            const px = waveX + noise;
            points.push({ x: px, y });

            // Spawn serpihan debu di sepanjang garis gelombang
            if (waveProgress > 0.03 && waveProgress < 0.97 && Math.random() < 0.75) {
              spawnDustAt(px, y);
            }
          }

          // Gambar garis kilau energi
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.strokeStyle = glowColor;
          ctx.lineWidth = 3.5;
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 16;
          ctx.stroke();
          ctx.shadowBlur = 0; // reset shadow
        }

        // 2. Render dan gerakkan partikel debu yang tertiup angin
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy + Math.sin((p.x + elapsed) * 0.035) * p.turb;
          p.angle += p.spin;
          p.alpha -= p.decay;
          p.size *= 0.982;

          // Hapus partikel jika sudah transparan, terlalu kecil, atau keluar layar
          if (p.alpha <= 0.02 || p.size <= 0.35 || p.x > width + 100) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          // Bentuk serpihan abu persegi tipis
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * (1 + Math.sin(p.angle) * 0.45));
          ctx.restore();
        }

        // 3. Lanjutkan frame jika durasi belum selesai atau masih ada partikel di udara
        if (progress < 1 || particles.length > 0) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, width, height);
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        if (ctx) ctx.clearRect(0, 0, width, height);
      };
    }
  }, [isDark, duration]);

  // Canvas SELALU ter-render di DOM agar ref selalu ada, namun 100% transparan dan tidak menghalangi klik
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none w-full h-full select-none ${className}`}
      style={{ zIndex }}
    />
  );
}
