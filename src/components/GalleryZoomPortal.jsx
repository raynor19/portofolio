import React, { useEffect, useRef } from 'react';
import TopographyCanvas from './TopographyCanvas';

/**
 * GalleryZoomPortal
 * Gerbang zoom portal tipografi eksponensial (menembus huruf "GALLERY").
 * Terinspirasi dari portal interaktif Eka Wahyu Maulidan.
 * Dioptimalkan untuk 60–120 FPS tanpa filter GPU berat pada teks vektor yang membesar.
 */
export default function GalleryZoomPortal({ isDark = false }) {
  const containerRef = useRef(null);
  const textGroupRef = useRef(null);
  const flashOverlayRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let curP = 0;
    let targetP = 0;
    let isVisible = true;

    const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const calc = () => {
      const rect = container.getBoundingClientRect();
      const maxScroll = Math.max(1, container.offsetHeight - window.innerHeight);
      targetP = clamp(-rect.top / maxScroll);
    };

    const update = () => {
      rafId = 0;
      if (!isVisible) return;

      // Smoothing lerp
      curP += (targetP - curP) * 0.16;
      if (Math.abs(targetP - curP) < 0.001) curP = targetP;

      const p = curP;
      const z = clamp(p / 0.85);
      const e = easeInOut(z);

      // Skala eksponensial dari 1x ke 95x
      const minScale = 1;
      const maxScale = 95;
      const scale = Math.exp(Math.log(minScale) + Math.log(maxScale / minScale) * e);

      // Rotasi miring organik halus (-3.5 deg di tengah)
      const rot = -3.5 * Math.sin(z * Math.PI);

      // Titik fokus kamera: bergeser dari tengah kata (x: 720) ke tengah huruf 'A' (x: 560)
      const curOriginX = 720 + (560 - 720) * e;
      const curOriginY = 450;

      const transformVal = `translate(720, 450) scale(${scale}) rotate(${rot}) translate(${-curOriginX}, ${-curOriginY})`;

      if (textGroupRef.current) {
        textGroupRef.current.setAttribute('transform', transformVal);
      }

      // Transisi latar belakang: saat skala mencapai > 30x (z >= 0.65),
      // warna latar belakang tujuan (#fafaf8 / #09090b) perlahan membaur penuh
      if (flashOverlayRef.current) {
        const overlayOpacity = clamp((z - 0.62) / 0.32);
        flashOverlayRef.current.style.opacity = overlayOpacity.toFixed(3);
      }

      if (Math.abs(targetP - curP) > 0.0005) {
        rafId = requestAnimationFrame(update);
      }
    };

    const onScroll = () => {
      if (!isVisible) return;
      calc();
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    // IntersectionObserver untuk hemat daya dan menghilangkan persaingan thread saat di luar layar
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) onScroll();
    }, { rootMargin: '120px 0px' });

    io.observe(container);

    calc();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full isolate select-none"
      style={{
        height: '210vh', // Jalur scroll bertahap
        backgroundColor: '#030712',
      }}
    >
      {/* Panggung Sticky Viewport 100svh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden isolate flex items-center justify-center">
        {/* Latar Belakang Gelap dengan Garis Kontur Topografi */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <TopographyCanvas theme="dark" opacity={0.4} />
          {/* Ambient glow biru kosmik menggunakan gradien alami (ringan tanpa blur berlebih) */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[28rem] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(56,189,248,0.25) 0%, rgba(56,189,248,0.08) 45%, transparent 70%)',
            }}
          />
        </div>

        {/* SVG Typography "GALLERY" (Ringan, murni vektor tanpa drop-shadow shader GPU berat) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <g ref={textGroupRef}>
            {/* Teks Huruf Padat & Terbaca Jelas */}
            <text
              x="720"
              y="450"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="145"
              fontWeight="900"
              letterSpacing="6"
              fill={isDark ? '#18181b' : '#fafaf8'}
              stroke={isDark ? '#38bdf8' : 'rgba(0, 0, 0, 0.15)'}
              strokeWidth="2.5"
              fontFamily="'Plus Jakarta Sans', 'Manrope', system-ui, sans-serif"
            >
              GALLERY
            </text>

            {/* Aksen Kilau Garis Tambahan */}
            <text
              x="720"
              y="450"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="145"
              fontWeight="900"
              letterSpacing="6"
              fill="none"
              stroke={isDark ? '#38bdf8' : '#ffffff'}
              strokeWidth="1.2"
              fontFamily="'Plus Jakarta Sans', 'Manrope', system-ui, sans-serif"
              opacity="0.85"
            >
              GALLERY
            </text>
          </g>
        </svg>

        {/* Lapisan Transisi Masuk ke Topografi Galeri (Fade Mulus di Akhir Zoom) */}
        <div
          ref={flashOverlayRef}
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-150 ease-out"
          style={{
            opacity: 0,
            backgroundColor: isDark ? '#09090b' : '#fafaf8',
          }}
        />
      </div>
    </div>
  );
}
