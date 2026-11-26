import React, { useEffect, useRef, useState, useMemo } from 'react';
import TopographyCanvas from './TopographyCanvas';

/**
 * Scattered3DGallery
 * Galeri foto 3D tersebar (scattered) dengan sudut rotasi organik & latar topografi,
 * terinspirasi dari portofolio Eka Wahyu Maulidan.
 *
 * Dioptimalkan untuk 60–120 FPS:
 * - IntersectionObserver: animasi hanya berjalan saat elemen terlihat di layar.
 * - Thumbnail terkompresi (w=600) untuk kartu panggung 250px (hemat memory & decode CPU 75%).
 * - Full resolution (w=1200) hanya saat foto diklik untuk lightbox preview.
 * - Direct DOM manipulation (0% React re-render saat scroll).
 * - Tanpa shader filter berat (backdrop-filter) pada kartu 3D.
 */
export default function Scattered3DGallery({
  items = [],
  isDark = false,
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Parallax kursor mouse
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  // Konfigurasi posisi dan parameter 3D organik untuk setiap kartu
  const cardConfigs = useMemo(() => {
    // 10 layout posisi organik (persentase dari viewport X & Y)
    // Diposisikan seimbang (y: 22vh - 34vh) agar berada pas di tengah layar
    // dengan jarak aman ~150px di bawah floating navbar tanpa menutupi menu
    const presets = [
      { x: -28, y: 22,  rot: -5, zStart: -450, speed: 1.05 },  // Kiri
      { x: 28,  y: 23,  rot: 4,  zStart: -250, speed: 1.0 },   // Kanan
      { x: -10, y: 26,  rot: -3, zStart: -700, speed: 1.15 },  // Tengah-kiri
      { x: -33, y: 28,  rot: 7,  zStart: -1050, speed: 1.1 },  // Kiri tengah
      { x: 31,  y: 28,  rot: -6, zStart: -500, speed: 0.95 },  // Kanan tengah
      { x: 10,  y: 30,  rot: 3,  zStart: -850, speed: 1.12 },  // Tengah-kanan
      { x: -18, y: 32,  rot: -7, zStart: -1300, speed: 1.2 },  // Kiri bawah
      { x: 20,  y: 33,  rot: 6,  zStart: -950, speed: 1.0 },   // Kanan bawah
      { x: 0,   y: 34,  rot: -4, zStart: -1450, speed: 1.25 }, // Tengah bawah
      { x: -34, y: 31,  rot: 5,  zStart: -1600, speed: 1.3 },  // Kiri paling bawah
    ];

    return items.map((item, i) => {
      const p = presets[i % presets.length];
      // Gunakan thumbnail w=600 untuk kartu kecil 250px agar rendering super ringan
      const thumb = item.src ? item.src.replace('w=1200', 'w=600') : item.src;
      return {
        ...item,
        thumb,
        x: p.x,
        y: p.y,
        rot: p.rot,
        zStart: p.zStart,
        speed: p.speed,
      };
    });
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let curP = 0;
    let targetP = 0;
    let isVisible = false;

    const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

    const calc = () => {
      const rect = container.getBoundingClientRect();
      const maxScroll = Math.max(1, container.offsetHeight - window.innerHeight);
      targetP = clamp(-rect.top / maxScroll);
    };

    const update = () => {
      rafId = 0;
      if (!isVisible) return;

      curP += (targetP - curP) * 0.16;
      if (Math.abs(targetP - curP) < 0.0006) curP = targetP;

      // Mouse lerp jika kursor aktif
      const m = mouseRef.current;
      if (m.active) {
        m.x += (m.targetX - m.x) * 0.1;
        m.y += (m.targetY - m.y) * 0.1;

        if (stageRef.current) {
          const tiltX = -m.y * 6;
          const tiltY = m.x * 6;
          stageRef.current.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
        }
      }

      // Update transformasi 3D setiap kartu foto
      const cards = cardsRef.current;
      const count = cardConfigs.length;

      for (let idx = 0; idx < count; idx++) {
        const el = cards[idx];
        if (!el) continue;
        const cfg = cardConfigs[idx];

        // Z meluncur dari zStart sampai menembus kamera (+500px)
        const travel = 2200 * cfg.speed;
        const currentZ = cfg.zStart + curP * travel;

        // Fading transparan yang halus
        let opacity = 1;
        if (currentZ < -1200) {
          opacity = clamp((currentZ + 1500) / 300);
        } else if (currentZ > 180) {
          opacity = clamp(1 - (currentZ - 180) / 320);
        }

        el.style.pointerEvents = currentZ > 350 || currentZ < -1300 ? 'none' : 'auto';
        el.style.opacity = opacity.toFixed(2);

        const depthScale = clamp(1 + currentZ * 0.0003, 0.4, 2.2);
        el.style.transform = `translate3d(calc(${cfg.x}vw - 50%), calc(${cfg.y}vh - 50%), ${currentZ.toFixed(1)}px) rotate(${cfg.rot}deg) scale(${depthScale.toFixed(3)})`;
      }

      if (Math.abs(targetP - curP) > 0.0005 || (m.active && Math.abs(m.targetX - m.x) > 0.001)) {
        rafId = requestAnimationFrame(update);
      }
    };

    const onScroll = () => {
      if (!isVisible) return;
      calc();
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    // IntersectionObserver: HANYA jalankan animasi 3D kartu saat galeri benar-benar masuk layar
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) onScroll();
    }, { rootMargin: '100px 0px' });

    io.observe(container);

    const onMouseMove = (e) => {
      if (!isVisible) return;
      mouseRef.current.active = true;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    calc();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [cardConfigs]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '260vh' }}
    >
      {/* Viewport Sticky 100svh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* Latar Belakang Garis Kontur Topografi */}
        <div
          className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
            isDark ? 'bg-[#09090b]' : 'bg-[#fafaf8]'
          }`}
        >
          <TopographyCanvas
            theme={isDark ? 'dark' : 'light'}
            opacity={isDark ? 0.35 : 0.65}
          />
        </div>

        {/* 3D Perspective Stage */}
        <div
          className="absolute inset-x-0 bottom-0 top-[4vh] flex items-center justify-center pointer-events-none"
          style={{
            perspective: '1000px',
            perspectiveOrigin: '50% 5%',
          }}
        >
          <div
            ref={stageRef}
            className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {cardConfigs.map((card, idx) => (
              <div
                key={card.src || idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                onClick={() => setSelectedPhoto(card)}
                className="group absolute cursor-pointer rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-3.5 transition-shadow duration-300 pointer-events-auto"
                style={{
                  width: 'clamp(170px, 22vw, 300px)',
                  backgroundColor: isDark ? '#18181b' : '#ffffff',
                  boxShadow: isDark
                    ? '0 16px 36px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)'
                    : '0 16px 36px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
                  willChange: 'transform',
                }}
              >
                {/* Frame Foto bergaya Polaroid Modern */}
                <div className="relative aspect-[4/3] sm:aspect-[4/3.2] w-full overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800">
                  <img
                    src={card.thumb || card.src}
                    alt={card.alt || card.title || 'Gallery item'}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {/* Subtle glass reflection overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Caption Bawah */}
                {(card.title || card.subtitle) && (
                  <div className="pt-2.5 pb-1 px-1 text-left">
                    {card.title && (
                      <h4
                        className="text-xs sm:text-sm font-bold truncate leading-tight transition-colors duration-300"
                        style={{
                          color: isDark ? '#f8fafc' : '#1e293b',
                        }}
                      >
                        {card.title}
                      </h4>
                    )}
                    {card.subtitle && (
                      <p
                        className="text-[10px] sm:text-xs truncate mt-0.5"
                        style={{
                          color: isDark ? '#94a3b8' : '#64748b',
                        }}
                      >
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                )}

                {/* Hover shine border */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px rounded-2xl md:rounded-3xl border border-sky-400/0 group-hover:border-sky-400/50 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Click-to-Inspect) */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border border-white/15 shadow-2xl transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Close preview"
            >
              ✕
            </button>

            {/* Gambar Besar Resolusi Penuh */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt || selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Keterangan */}
            <div className="p-5 md:p-6 bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight">
                  {selectedPhoto.title}
                </h3>
                {selectedPhoto.subtitle && (
                  <p className="text-sm text-zinc-400 mt-1">
                    {selectedPhoto.subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-zinc-900 hover:bg-sky-200 transition-colors self-start sm:self-auto"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
