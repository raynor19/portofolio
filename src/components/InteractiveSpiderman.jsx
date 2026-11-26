import React, { useState } from 'react';

/**
 * InteractiveSpiderman:
 * Animasi realistis Spider-Man jatuh bebas di bawah gaya gravitasi,
 * tertahan elastis oleh tali jaring laba-laba, memantul di bawah,
 * lalu memanjat jaring secara ritmis bertahap (stroke by stroke)
 * dan melompat mendarat anggun kembali ke posisi duduk semula di atas kartu CSS.
 */
export default function InteractiveSpiderman() {
  const [animating, setAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (animating) return;

    setAnimating(true);

    // Total durasi animasi: 3.2 detik
    setTimeout(() => {
      setAnimating(false);
    }, 3200);
  };

  return (
    <>
      <style>{`
        /* Animasi Fisika Jatuh Gravitasi & Memanjat Ritmis Spider-Man */
        @keyframes spidey-real-fall-climb {
          /* 0%: Duduk tenang di atas kartu */
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1, 1);
            transform-origin: 50% 90%;
          }

          /* 3%: Kehilangan keseimbangan, tergelincir ke belakang */
          3% {
            transform: translate3d(2px, -6px, 0) rotate(-6deg) scale(0.98, 1.02);
          }

          /* 7%: Tergelincir lepas dari bibir kartu, mulai jatuh */
          7% {
            transform: translate3d(6px, 6px, 0) rotate(10deg) scale(0.97, 1.03);
          }

          /* 15%: Akselerasi jatuh bebas gravitasi (Free fall) */
          15% {
            transform: translate3d(12px, 100px, 0) rotate(16deg) scale(0.94, 1.07);
          }

          /* 23%: Meluncur cepat menembus udara ke bawah kartu */
          23% {
            transform: translate3d(6px, 245px, 0) rotate(8deg) scale(0.93, 1.09);
          }

          /* 29%: Titik jatuh terbawah saat jaring laba-laba pertama menahan */
          29% {
            transform: translate3d(0, 350px, 0) rotate(-4deg) scale(0.96, 1.05);
          }

          /* 33%: Regangan elastis jaring laba-laba (Impact Squash & Pendulum) */
          33% {
            transform: translate3d(-4px, 375px, 0) rotate(-14deg) scale(1.08, 0.90);
          }

          /* 38%: Pantulan elastis ke atas */
          38% {
            transform: translate3d(5px, 335px, 0) rotate(8deg) scale(0.97, 1.03);
          }

          /* 42%: Ayunan kedua menstabilkan diri */
          42% {
            transform: translate3d(-2px, 352px, 0) rotate(-4deg) scale(1.02, 0.98);
          }

          /* 46%: Diam di tali jaring, bersiap memanjat */
          46% {
            transform: translate3d(0, 345px, 0) rotate(0deg) scale(1, 1);
          }

          /* === TAHAP 1: TARIKAN MEMANJAT PERTAMA (Tangan Kiri) === */
          /* 49%: Antisipasi tarikan (sedikit menekuk tubuh) */
          49% {
            transform: translate3d(0, 350px, 0) rotate(-3deg) scale(1.03, 0.96);
          }
          /* 56%: TARIKAN KUAT 1 - tubuh melesat naik ~110px! */
          56% {
            transform: translate3d(-8px, 238px, 0) rotate(-9deg) scale(0.94, 1.07);
          }
          /* 61%: Jeda antar tarikan, tangan kanan meraih jaring lebih tinggi */
          61% {
            transform: translate3d(-2px, 230px, 0) rotate(2deg) scale(1.01, 0.99);
          }

          /* === TAHAP 2: TARIKAN MEMANJAT KEDUA (Tangan Kanan) === */
          /* 63%: Menekuk pegangan jaring */
          63% {
            transform: translate3d(-1px, 234px, 0) rotate(4deg) scale(1.02, 0.97);
          }
          /* 70%: TARIKAN KUAT 2 - tubuh melesat naik ~125px! */
          70% {
            transform: translate3d(8px, 108px, 0) rotate(8deg) scale(0.95, 1.06);
          }
          /* 75%: Menyiapkan momentum lompatan akhir ke atas kartu */
          75% {
            transform: translate3d(3px, 100px, 0) rotate(-2deg) scale(1.01, 0.99);
          }

          /* === TAHAP 3: LOMPATAN AKHIR & PENDARATAN ANGGUN === */
          /* 82%: Melesat melompati bibir atas kartu */
          82% {
            transform: translate3d(0, -22px, 0) rotate(-4deg) scale(0.96, 1.07);
          }
          /* 88%: Puncak lompatan di atas kartu */
          88% {
            transform: translate3d(0, -26px, 0) rotate(1deg) scale(1.02, 0.98);
          }
          /* 93%: Mendarat di bibir kartu (Impact landing cushion) */
          93% {
            transform: translate3d(0, 4px, 0) rotate(0deg) scale(1.06, 0.93);
          }
          /* 97%: Pegas balik lembut */
          97% {
            transform: translate3d(0, -2px, 0) rotate(0deg) scale(0.99, 1.01);
          }
          /* 100%: Kembali duduk anggun dan santai */
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1, 1);
          }
        }

        /* Regangan Tali Jaring Laba-laba Sutra yang Presisi */
        @keyframes spidey-real-web-stretch {
          0% {
            opacity: 0;
            height: 0px;
          }
          7% {
            opacity: 0.95;
            height: 10px;
          }
          15% {
            opacity: 1;
            height: 105px;
          }
          23% {
            opacity: 1;
            height: 250px;
          }
          29% {
            opacity: 1;
            height: 355px;
          }
          33% {
            opacity: 1;
            height: 380px;
          }
          38% {
            opacity: 1;
            height: 340px;
          }
          42% {
            opacity: 1;
            height: 356px;
          }
          46% {
            opacity: 1;
            height: 350px;
          }
          /* Tarikan 1 */
          49% {
            opacity: 1;
            height: 355px;
          }
          56% {
            opacity: 1;
            height: 243px;
          }
          61% {
            opacity: 1;
            height: 235px;
          }
          /* Tarikan 2 */
          63% {
            opacity: 1;
            height: 239px;
          }
          70% {
            opacity: 1;
            height: 113px;
          }
          75% {
            opacity: 1;
            height: 105px;
          }
          /* Saat melompati bibir kartu, jaring larut rapi */
          82% {
            opacity: 0.8;
            height: 8px;
          }
          86% {
            opacity: 0;
            height: 0px;
          }
          100% {
            opacity: 0;
            height: 0px;
          }
        }

        .spidey-real-animating {
          animation: spidey-real-fall-climb 3.2s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
        }

        .spidey-real-web-animating {
          animation: spidey-real-web-stretch 3.2s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
        }
      `}</style>

      {/* Container utama Spider-Man interaktif */}
      <div
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 bottom-[calc(100%-4px)] z-50 select-none cursor-pointer group/spidey"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
          }
        }}
        aria-label="Spider-Man. Klik untuk melihat aksi jatuh dan memanjat jaring laba-laba"
        style={{
          width: 'clamp(90px, 9vw, 115px)',
          touchAction: 'manipulation',
        }}
      >
        {/* Titik Jangkar Jaring Laba-Laba (Web Splat Node) pada bibir kartu */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-[88%] z-40 pointer-events-none transition-all duration-300 ${
            animating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff 30%, rgba(186,230,253,0.9) 60%, transparent 80%)',
            boxShadow: '0 0 8px #ffffff, 0 0 16px rgba(56,189,248,0.7)',
          }}
        />

        {/* Tali Jaring Sutra Laba-laba Bercahaya */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-[90%] pointer-events-none z-30 ${
            animating ? 'spidey-real-web-animating' : 'opacity-0'
          }`}
          style={{
            width: '2px',
            background: 'linear-gradient(to bottom, #ffffff, #e0f2fe, #bae6fd, #ffffff)',
            boxShadow: '0 0 4px #ffffff, 0 0 10px rgba(56,189,248,0.8)',
            transformOrigin: 'top center',
            borderRadius: '9999px',
          }}
        />

        {/* Gambar Spider-Man */}
        <div
          className={`relative transition-transform duration-300 ${
            animating ? 'spidey-real-animating' : 'group-hover/spidey:scale-105 group-hover/spidey:-translate-y-1'
          }`}
          style={{
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.38))',
          }}
        >
          <img
            src="/spiderman-sitting.png"
            alt="Spider-Man"
            className="w-full h-auto object-contain block"
            draggable="false"
          />

          {/* Tooltip Petunjuk Elegan & Minimalis "Klik aku! 🕷️" saat kursor hover */}
          {!animating && showTooltip && (
            <div
              className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/85 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-md border border-white/20 whitespace-nowrap pointer-events-none animate-fade-in"
              style={{
                backdropFilter: 'blur(8px)',
              }}
            >
              Klik aku! 🕷️
            </div>
          )}
        </div>
      </div>
    </>
  );
}
