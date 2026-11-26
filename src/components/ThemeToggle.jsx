import React from 'react';

/**
 * <ThemeToggle isDark={isDark} onToggle={() => {}} />
 * Tombol pengubah tema (Light ☀️ / Dark 🌙) dengan gaya pill modern kaca,
 * senada dengan LanguageToggle, GooeyNav, dan SpecularButton.
 */
export default function ThemeToggle({ isDark = false, onToggle, className = '' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode (Thanos Snap)'}
      className={`group relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(10,10,14,0.92)] text-white backdrop-blur-xl border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.25)] select-none cursor-pointer transition-all duration-300 hover:border-white/35 hover:scale-105 active:scale-95 ${className}`}
    >
      {/* Halo glow tipis di belakang ikon */}
      <span
        className={`absolute inset-0 rounded-full transition-opacity duration-500 blur-sm ${
          isDark ? 'bg-indigo-500/30 opacity-70' : 'bg-amber-400/25 opacity-0 group-hover:opacity-100'
        }`}
      />

      {/* Kontainer ikon dengan efek rotasi & transisi halus */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Ikon Matahari (Light Mode) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 w-full h-full text-amber-300 transition-all duration-500 transform ${
            isDark
              ? 'scale-0 rotate-90 opacity-0'
              : 'scale-100 rotate-0 opacity-100'
          }`}
        >
          <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M6.34 17.66l-1.41 1.41" />
          <path d="M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Ikon Bulan (Dark Mode) */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 w-full h-full text-sky-300 transition-all duration-500 transform ${
            isDark
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 -rotate-90 opacity-0'
          }`}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" fillOpacity="0.25" />
          {/* Titik bintang kecil khas dark mode */}
          <circle cx="19" cy="5" r="1" fill="#7dd3fc" stroke="none" />
        </svg>
      </div>
    </button>
  );
}
