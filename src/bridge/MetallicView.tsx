import { motion } from 'framer-motion';
import type { ZoneState } from '../canvas/types';

interface Props {
  slotA: ZoneState;
  slotB: ZoneState;
}

// Metal ion grid: 6 ions in a 3×2 arrangement, alternating A and B symbols
const ION_POSITIONS = [
  { x: 40,  y: 36,  idx: 0 },
  { x: 100, y: 36,  idx: 1 },
  { x: 160, y: 36,  idx: 0 },
  { x: 40,  y: 90,  idx: 1 },
  { x: 100, y: 90,  idx: 0 },
  { x: 160, y: 90,  idx: 1 },
];

// Free electron starting positions and drift paths
const ELECTRONS = [
  { x0: 70,  y0: 22,  dx: 60,  dy: 40 },
  { x0: 130, y0: 18,  dx: -50, dy: 55 },
  { x0: 25,  y0: 60,  dx: 90,  dy: -20 },
  { x0: 175, y0: 55,  dx: -80, dy: 30 },
  { x0: 55,  y0: 110, dx: 100, dy: -45 },
  { x0: 145, y0: 108, dx: -60, dy: -50 },
  { x0: 85,  y0: 62,  dx: 50,  dy: -40 },
];

const CLRS = ['var(--color-cation)', 'var(--color-anion)'];

export function MetallicView({ slotA, slotB }: Props) {
  const symbols = [slotA.symbol, slotB.symbol];
  const homonuclear = slotA.symbol === slotB.symbol;
  const formula = homonuclear ? slotA.symbol : `${slotA.symbol}-${slotB.symbol}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[9px] text-white/35 uppercase tracking-widest">Metallic Bond</span>

      {/* SVG diagram */}
      <div className="relative rounded-xl border border-white/10 bg-white/3 overflow-hidden" style={{ width: 200, height: 126 }}>
        <svg width={200} height={126} viewBox="0 0 200 126">
          {/* Ion cores */}
          {ION_POSITIONS.map((ion, i) => {
            const sym = symbols[ion.idx];
            const clr = CLRS[ion.idx];
            return (
              <g key={i}>
                <circle cx={ion.x} cy={ion.y} r={18} fill={clr} fillOpacity="0.12" stroke={clr} strokeOpacity="0.4" strokeWidth="1.5" />
                <text x={ion.x} y={ion.y + 5} textAnchor="middle" fill={clr} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  {sym}
                </text>
                {/* positive charge superscript */}
                <text x={ion.x + 13} y={ion.y - 10} fill={clr} fontSize="7" fontFamily="sans-serif" opacity="0.7">+</text>
              </g>
            );
          })}

          {/* Animated free electrons */}
          {ELECTRONS.map((e, i) => (
            <motion.circle
              key={i}
              cx={e.x0}
              cy={e.y0}
              r={3}
              fill="rgba(200,220,255,0.85)"
              animate={{
                cx: [e.x0, e.x0 + e.dx, e.x0 + e.dx * 0.4, e.x0],
                cy: [e.y0, e.y0 + e.dy, e.y0 + e.dy * 0.7, e.y0],
              }}
              transition={{
                duration: 3 + (i % 3) * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            />
          ))}

          {/* "e⁻" label */}
          <text x={5} y={121} fill="rgba(200,220,255,0.5)" fontSize="8" fontFamily="sans-serif">e⁻ sea</text>
        </svg>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xl font-bold text-white">{formula}</span>
        <span className="text-[9px] text-white/40 uppercase tracking-widest">
          {homonuclear ? 'Pure metal · metallic bond' : 'Alloy · metallic bond'}
        </span>
        <span className="text-[8px] text-white/25 mt-0.5">
          Delocalised electrons form a conducting sea
        </span>
      </div>
    </div>
  );
}
