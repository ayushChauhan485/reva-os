// Original icon set for Reva OS. 48×48, ink outlines, flat fills,
// hard drop-shadow applied in CSS (.appicon).
import type { AppId } from '../data/apps';

const S = { stroke: '#343342', strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export function AppIcon({ id, size = 48 }: { id: AppId; size?: number }) {
  return (
    <svg className="appicon" viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      {ICONS[id]}
    </svg>
  );
}

const ICONS: Record<AppId, React.ReactNode> = {
  archive: (
    <g {...S}>
      <path d="M5 13h14l3 4h21v23a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" fill="#C9A24B" />
      <rect x="11" y="9" width="17" height="21" rx="1" fill="#FAF7F0" transform="rotate(-8 19 19)" />
      <path d="M13 12.5l11-1.5M13.6 16.5l8-1.1" transform="rotate(-8 19 19)" strokeWidth="1.5" />
      <rect x="21" y="8" width="16" height="19" rx="1" fill="#AFC5DB" transform="rotate(7 29 18)" />
      <circle cx="31" cy="15" r="3" fill="#D9D49A" transform="rotate(7 29 18)" strokeWidth="1.5" />
      <path d="M5 21h38v19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" fill="#D9D49A" />
      <path d="M19 28h10" />
    </g>
  ),
  photos: (
    <g {...S}>
      <rect x="9" y="12" width="28" height="30" rx="1.5" fill="#FAF7F0" transform="rotate(-9 23 27)" />
      <rect x="12" y="15" width="22" height="18" fill="#AFC5DB" transform="rotate(-9 23 27)" />
      <rect x="14" y="8" width="28" height="31" rx="1.5" fill="#FAF7F0" transform="rotate(6 28 23)" />
      <rect x="17" y="11" width="22" height="19" fill="#D6B9D0" transform="rotate(6 28 23)" />
      <circle cx="31" cy="17" r="3" fill="#D9D49A" strokeWidth="1.5" transform="rotate(6 28 23)" />
      <path d="M18 29l6-7 5 5 4-3 6 6" fill="none" strokeWidth="1.6" transform="rotate(6 28 23)" />
    </g>
  ),
  flowers: (
    <g {...S}>
      <path d="M24 26v10" />
      <path d="M24 33c-4-1-7-4-8-8 4 0 7 3 8 8z" fill="#6F9A6A" />
      <path d="M24 9c3 4 3 9 0 13-3-4-3-9 0-13z" fill="#FAF7F0" />
      <path d="M24 22c-5 1-10-1-13-5 5-1 10 1 13 5z" fill="#FAF7F0" />
      <path d="M24 22c5 1 10-1 13-5-5-1-10 1-13 5z" fill="#FAF7F0" />
      <path d="M24 22c-2 3-6 5-10 5 1-4 5-6 10-5zM24 22c2 3 6 5 10 5-1-4-5-6-10-5z" fill="#D6B9D0" />
      <path d="M24 13v7M17 18.5l5 2.5M31 18.5l-5 2.5" stroke="#E5539B" strokeWidth="1.5" />
      <path d="M15 36h18l-2.5 8h-13z" fill="#AFC5DB" />
    </g>
  ),
  dictionary: (
    <g {...S}>
      <path d="M10 8h25a3 3 0 0 1 3 3v29H13a3 3 0 0 1-3-3z" fill="#D6B9D0" />
      <path d="M10 37a3 3 0 0 1 3-3h25v6H13a3 3 0 0 1-3-3z" fill="#FAF7F0" />
      <path d="M16 14h16v10H16z" fill="#FAF7F0" />
      <text x="24" y="22.5" textAnchor="middle" fontFamily="Fraunces Variable, Georgia, serif" fontSize="9" fontWeight="700" fill="#343342" stroke="none">
        R
      </text>
      <path d="M30 34v10l2.5-2 2.5 2V34" fill="#D9473B" />
    </g>
  ),
  calendar: (
    <g {...S}>
      <rect x="8" y="10" width="32" height="32" rx="3" fill="#FAF7F0" />
      <path d="M8 13a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v6H8z" fill="#D9473B" />
      <path d="M15 6v8M33 6v8" />
      <text x="24" y="36.5" textAnchor="middle" fontFamily="Fraunces Variable, Georgia, serif" fontSize="16" fontWeight="700" fill="#343342" stroke="none">
        27
      </text>
      <circle cx="37" cy="37" r="5" fill="#D9D49A" />
      <path d="M35 37l1.5 1.5L39 36" strokeWidth="1.5" />
    </g>
  ),
  awards: (
    <g {...S}>
      <path d="M15 8h18v8a9 9 0 0 1-18 0z" fill="#E8C46A" />
      <path d="M15 11H9a6 6 0 0 0 7 8M33 11h6a6 6 0 0 1-7 8" fill="none" />
      <path d="M22 25h4v6h-4z" fill="#C9A24B" />
      <path d="M16 31h16l2 6H14z" fill="#5C1A2A" />
      <path d="M13 37h22v5H13z" fill="#C9A24B" />
      <path d="M20 12l1.6 3.2 3.4.5-2.5 2.4.6 3.4L20 20l-3.1 1.6.6-3.4L15 15.7l3.4-.5z" fill="#FAF7F0" strokeWidth="1.2" transform="translate(4 -1)" />
    </g>
  ),
  terminal: (
    <g {...S}>
      <rect x="5" y="9" width="38" height="30" rx="3" fill="#343342" />
      <path d="M5 15h38" stroke="#FAF7F0" strokeWidth="1" opacity="0.5" />
      <path d="M11 22l5 4-5 4" stroke="#D9D49A" />
      <path d="M19 31h9" stroke="#FAF7F0" />
      <circle cx="36" cy="27" r="3.4" fill="#AFC5DB" stroke="#FAF7F0" strokeWidth="1.2" />
      <path d="M39.5 27l2-1.6v3.2z" fill="#AFC5DB" stroke="#FAF7F0" strokeWidth="1" />
    </g>
  ),
  classified: (
    <g {...S}>
      <path d="M5 13h13l3 4h22v23a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" fill="#B98FB0" />
      <path d="M5 20h38v20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" fill="#E2D6C2" />
      <rect x="10" y="25" width="22" height="8" rx="1" fill="none" stroke="#D9473B" strokeWidth="1.6" transform="rotate(-8 21 29)" />
      <path d="M13 29.5h16" stroke="#D9473B" strokeWidth="1.6" transform="rotate(-8 21 29)" strokeDasharray="2 1.5" />
      <rect x="32" y="29" width="11" height="9" rx="1.5" fill="#D9D49A" />
      <path d="M34.5 29v-2.5a3 3 0 0 1 6 0V29" fill="none" />
    </g>
  ),
  settings: (
    <g {...S}>
      <path
        d="M24 6l3 1 1 4 3 2 4-1 2 3-2 4v3l3 3-1 3-4 1-2 3 1 4-3 2-3-2h-3l-3 3-3-1-1-4-3-2-4 1-2-3 2-4v-3l-3-3 1-3 4-1 2-3-1-4 3-2z"
        fill="#AFC5DB"
        transform="translate(1 1) scale(0.96)"
      />
      <circle cx="24" cy="24" r="7" fill="#FAF7F0" />
      <circle cx="24" cy="24" r="2" fill="#343342" />
    </g>
  ),
  lostfound: (
    <g {...S}>
      <path d="M6 18l18-7 18 7-18 7z" fill="#D9D49A" />
      <path d="M6 18v18l18 8V25z" fill="#C9A24B" />
      <path d="M42 18v18l-18 8V25z" fill="#E2C77A" />
      <text x="33" y="37" textAnchor="middle" fontFamily="Silkscreen, monospace" fontSize="9" fill="#343342" stroke="none">
        ?
      </text>
    </g>
  ),
  about: (
    <g {...S}>
      <path d="M12 6h18l8 8v28H12z" fill="#FAF7F0" />
      <path d="M30 6v8h8" fill="#E2D6C2" />
      <path d="M17 20h14M17 25h14M17 30h10" strokeWidth="1.6" />
    </g>
  ),
};

/** Original pufferfish mascot. `puffed` swells the body and spikes. */
export function Pufferfish({ puffed = false, size = 64 }: { puffed?: boolean; size?: number }) {
  const r = puffed ? 17 : 14;
  const spikes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const len = puffed ? 6 : 3;
    return (
      <path
        key={i}
        d={`M${30 + Math.cos(a) * r} ${32 + Math.sin(a) * r}L${30 + Math.cos(a) * (r + len)} ${32 + Math.sin(a) * (r + len)}`}
        stroke="#343342"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    );
  });
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" style={{ overflow: 'visible' }}>
      <g style={{ transition: 'transform 200ms' }}>
        {spikes}
        <path d="M44 32l12-8v16z" fill="#AFC5DB" stroke="#343342" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="30" cy="32" r={r} fill="#D9D49A" stroke="#343342" strokeWidth="2" />
        <path d={`M${30 - r + 3} 36q${r - 3} ${puffed ? 12 : 9} ${2 * r - 6} 0`} fill="#FAF7F0" stroke="#343342" strokeWidth="1.5" />
        <circle cx="23" cy="28" r="4.2" fill="#FAF7F0" stroke="#343342" strokeWidth="1.5" />
        <circle cx="22.2" cy="28.4" r="2" fill="#343342" />
        <path d={puffed ? 'M15 34.5a2 2 0 1 0 0.1 0' : 'M15.5 33q1.5 1.5 3 0'} fill="none" stroke="#343342" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 30q4-5 7 0" fill="#D6B9D0" stroke="#343342" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="19" cy="33" r="1.8" fill="#D6B9D0" opacity="0.8" />
      </g>
    </svg>
  );
}

export function RevaLogo({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#D6B9D0" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 17V7h4a3 3 0 0 1 0 6h-4m4 0l3 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
