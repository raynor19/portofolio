import React, { useRef, useState, useEffect } from 'react';
import './GlassFolder.css';

const BACK_MASK = `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20340%20272%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M0%2056A22%2022%200%200%201%2022%2034L146%2034C170%2034%20172%200%20198%200L318%200A22%2022%200%200%201%20340%2022L340%20250A22%2022%200%200%201%20318%20272L22%20272A22%2022%200%200%201%200%20250Z%22%2F%3E%3C%2Fsvg%3E")`;
const FRONT_MASK = `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20340%20198%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M0%2022A22%2022%200%200%201%2022%200L118%200C144%200%20146%2032%20172%2032L318%2032A22%2022%200%200%201%20340%2054L340%20176A22%2022%200%200%201%20318%20198L22%20198A22%2022%200%200%201%200%20176Z%22%2F%3E%3C%2Fsvg%3E")`;

const JITTER = [
  { jx: '-4.5px', jr: '1.5deg' },
  { jx: '0.1px', jr: '-0.4deg' },
  { jx: '-3.2px', jr: '-1.0deg' },
  { jx: '1.2px', jr: '0.2deg' },
];

export default function GlassFolder({
  id,
  title,
  count,
  sheets = [],
  isOpen = false,
  onToggle,
  onSelectSheet,
  tone = 'dark',
}) {
  const rootRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  const handlePointerMove = (e) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2));
    const py = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2));
    el.style.setProperty('--gf-px', px.toFixed(3));
    el.style.setProperty('--gf-py', py.toFixed(3));
  };

  const handlePointerLeave = () => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--gf-px', '0');
    el.style.setProperty('--gf-py', '0');
  };

  const numSheets = sheets.length || 4;

  return (
    <div
      ref={rootRef}
      className="gf-root"
      data-tone={tone}
      data-open={isOpen ? 'true' : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="gf-stage">
        <div className="gf-tilt">
          {/* Shadow beneath folder */}
          <div className="gf-shadow" aria-hidden="true" />

          {/* Back plate of folder */}
          <div
            className="gf-back"
            aria-hidden="true"
            style={{
              maskImage: BACK_MASK,
              WebkitMaskImage: BACK_MASK,
            }}
          >
            <div className="gf-back-sheen" />
          </div>

          {/* Back rim stroke */}
          <svg className="gf-rim gf-back-rim" viewBox="0 0 340 272" aria-hidden="true">
            <path d="M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z" />
          </svg>

          {/* Internal Stacked Preview Sheets */}
          <div className="gf-files" role="list" aria-label={`${title} contents`}>
            {sheets.map((sheet, idx) => {
              const slot = numSheets > 1 ? (idx / (numSheets - 1)) * 2 - 1 : 0;
              const depth = numSheets - 1 - idx;
              const jit = JITTER[idx % JITTER.length];
              return (
                <div key={idx} role="listitem" className="gf-sheet-slot">
                  <button
                    className="gf-sheet"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSheet && onSelectSheet(sheet, title);
                    }}
                    style={{
                      '--gf-slot': slot,
                      '--gf-depth': depth,
                      '--gf-jx': jit.jx,
                      '--gf-jr': jit.jr,
                      zIndex: idx + 1,
                    }}
                    aria-label={sheet.title || `Item ${idx + 1}`}
                  >
                    <img
                      className="gf-sheet-art"
                      src={sheet.src}
                      alt={sheet.alt || sheet.title || ''}
                      width="272"
                      height="184"
                      loading="lazy"
                      draggable="false"
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Front glass flap */}
          <div
            className="gf-front"
            style={{
              maskImage: FRONT_MASK,
              WebkitMaskImage: FRONT_MASK,
            }}
          >
            <div className="gf-tint" aria-hidden="true" />
            <div className="gf-spec" aria-hidden="true" />

            <svg className="gf-rim gf-front-rim" viewBox="0 0 340 198" aria-hidden="true">
              <defs>
                <linearGradient id={`gf-rim-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="0.35" stopColor="#fff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path
                d="M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 176A22 22 0 0 1 318 198L22 198A22 22 0 0 1 0 176Z"
                stroke={`url(#gf-rim-${id})`}
              />
            </svg>

            {/* Click hit area to open/close folder */}
            <button
              type="button"
              className="gf-hit"
              aria-expanded={isOpen}
              aria-label={`${isOpen ? 'Close' : 'Open'} ${title}, ${count} items`}
              onClick={() => onToggle && onToggle(id)}
            />

            {/* Title & Counter */}
            <div className="gf-label">
              <span className="gf-meta">{count}</span>
              <span className="gf-title">{title}</span>
            </div>
          </div>

          {/* 3 dots button */}
          <button
            type="button"
            className="gf-key gf-key--more"
            aria-label={`Options for ${title}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
          >
            <svg className="gf-glyph gf-glyph--more" viewBox="0 0 30 12" aria-hidden="true">
              <rect x="1" y="1.5" width="8" height="9" rx="3.4" />
              <rect x="11" y="1.5" width="8" height="9" rx="3.4" />
              <rect x="21" y="1.5" width="8" height="9" rx="3.4" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="gf-menu" data-open="true" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="gf-menu-item"
                onClick={() => {
                  setShowMenu(false);
                  onToggle && onToggle(id);
                }}
              >
                {isOpen ? 'Close Folder' : 'Open Folder'}
              </button>
              <button
                type="button"
                className="gf-menu-item"
                onClick={() => {
                  setShowMenu(false);
                  if (sheets[0]) onSelectSheet && onSelectSheet(sheets[0], title);
                }}
              >
                Preview Latest
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
