import React, { useState } from 'react';

/**
 * InteractiveSpiderman:
 * Easter egg interaktif di atas kartu CSS.
 * Saat diklik, Spider-Man tergelincir jatuh ke bawah kartu,
 * menembakkan jaring laba-laba (THWIP!), memantul elastis,
 * lalu memanjat jaringnya kembali ke posisi duduk semula.
 */
export default function InteractiveSpiderman() {
  const [animating, setAnimating] = useState(false);
  const [comicText, setComicText] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (animating) return;

    setAnimating(true);
    setComicText('WHOA! 🕸️');

    // Tahap 1: Tergelincir & jatuh
    setTimeout(() => {
      setComicText('THWIP! 🕷️');
    }, 850);

    // Tahap 2: Tarik jaring & naik kembali
    setTimeout(() => {
      setComicText('LANDED! ✨');
    }, 1750);

    // Selesai & reset
    setTimeout(() => {
      setAnimating(false);
      setComicText('');
    }, 2350);
  };

  return (
    <>
      <style>{`
        @keyframes spidey-drop-climb {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          /* Tergelincir panik */
          8% {
            transform: translate3d(8px, -14px, 0) rotate(18deg) scale(0.97);
          }
          /* Meluncur jatuh cepat ke bawah kartu */
          25% {
            transform: translate3d(16px, 160px, 0) rotate(48deg) scale(0.92);
          }
          /* Titik jatuh terbawah (overshoot) */
          42% {
            transform: translate3d(-10px, 320px, 0) rotate(-20deg) scale(0.88);
          }
          /* Jaring menahan - pantulan elastis di bawah */
          52% {
            transform: translate3d(8px, 285px, 0) rotate(14deg) scale(0.92);
          }
          60% {
            transform: translate3d(-4px, 305px, 0) rotate(-6deg) scale(0.94);
          }
          /* Menembakkan & menarik jaring ke atas (ZIP!) */
          76% {
            transform: translate3d(0, 75px, 0) rotate(-5deg) scale(1);
          }
          /* Melompat melewati tepi kartu */
          88% {
            transform: translate3d(0, -18px, 0) rotate(4deg) scale(1.08);
          }
          94% {
            transform: translate3d(0, 4px, 0) rotate(-1deg) scale(0.98);
          }
          /* Mendarat duduk santai kembali */
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes spidey-web-stretch {
          0% {
            opacity: 0;
            height: 0px;
          }
          8% {
            opacity: 1;
            height: 14px;
          }
          25% {
            opacity: 1;
            height: 170px;
          }
          42% {
            opacity: 1;
            height: 330px;
          }
          52% {
            opacity: 1;
            height: 295px;
          }
          60% {
            opacity: 1;
            height: 315px;
          }
          76% {
            opacity: 1;
            height: 85px;
          }
          88% {
            opacity: 0.8;
            height: 12px;
          }
          94% {
            opacity: 0;
            height: 0px;
          }
          100% {
            opacity: 0;
            height: 0px;
          }
        }

        .spidey-animating {
          animation: spidey-drop-climb 2.35s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
        }

        .spidey-web-animating {
          animation: spidey-web-stretch 2.35s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
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
        aria-label="Spider-Man sitting on card. Click to trigger jump and climb animation"
        style={{
          width: 'clamp(90px, 9vw, 115px)',
          touchAction: 'manipulation',
        }}
      >
        {/* Tali Jaring Laba-Laba Putih Bercahaya */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-[82%] pointer-events-none ${
            animating ? 'spidey-web-animating' : 'opacity-0'
          }`}
          style={{
            width: '2px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(186,230,253,0.9), rgba(255,255,255,0.95))',
            boxShadow: '0 0 6px rgba(255,255,255,0.9), 0 0 12px rgba(56,189,248,0.6)',
            transformOrigin: 'top center',
            borderRadius: '9999px',
          }}
        />

        {/* Gambar Spider-Man */}
        <div
          className={`relative transition-transform duration-300 ${
            animating ? 'spidey-animating' : 'group-hover/spidey:scale-105 group-hover/spidey:-translate-y-1'
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

          {/* Efek gelembung suara comic (WHOA!, THWIP!, LANDED!) */}
          {animating && comicText && (
            <div
              className="absolute -top-6 -right-6 sm:-right-8 bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-lg border-2 border-white pointer-events-none animate-bounce tracking-wider whitespace-nowrap z-40"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.6)',
              }}
            >
              {comicText}
            </div>
          )}

          {/* Tooltip Petunjuk "Klik aku!" saat kursor hover sebelum diklik */}
          {!animating && showTooltip && (
            <div
              className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/85 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md border border-white/20 whitespace-nowrap pointer-events-none animate-fade-in"
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
