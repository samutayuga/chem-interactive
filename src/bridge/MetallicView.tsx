import { motion } from 'framer-motion';
import type { ZoneState } from '../canvas/types';

interface Props {
  slotA: ZoneState;
  slotB: ZoneState;
}

// Metal cation grid: 6 ions in a 3×2 arrangement, alternating A and B
const ION_POSITIONS = [
  { x: 40,  y: 36,  idx: 0 },
  { x: 100, y: 36,  idx: 1 },
  { x: 160, y: 36,  idx: 0 },
  { x: 40,  y: 90,  idx: 1 },
  { x: 100, y: 90,  idx: 0 },
  { x: 160, y: 90,  idx: 1 },
];

// Pool of positions for delocalised electrons — pick N from this list
const ELECTRON_POOL = [
  { x0: 70,  y0: 18,  dx:  55, dy:  38 },
  { x0: 130, y0: 15,  dx: -48, dy:  52 },
  { x0: 22,  y0: 58,  dx:  82, dy: -18 },
  { x0: 178, y0: 52,  dx: -72, dy:  28 },
  { x0: 52,  y0: 110, dx:  88, dy: -42 },
  { x0: 150, y0: 108, dx: -58, dy: -46 },
  { x0: 88,  y0: 60,  dx:  48, dy: -40 },
  { x0: 14,  y0: 88,  dx:  62, dy: -32 },
  { x0: 186, y0: 80,  dx: -58, dy: -28 },
  { x0: 100, y0: 115, dx: -32, dy: -52 },
  { x0: 62,  y0: 42,  dx:  70, dy:  42 },
  { x0: 138, y0: 80,  dx: -65, dy: -35 },
];

// Both metals are positive cations — orange family; A darker, B lighter to distinguish in alloy
const CLRS = ['#f97316', '#fb923c'];

export function MetallicView({ slotA, slotB }: Props) {
  const symbols = [slotA.symbol, slotB.symbol];
  const homonuclear = slotA.symbol === slotB.symbol;

  // Each of the 6 lattice sites contributes valence electrons to the sea
  const electronCount = Math.min(
    3 * slotA.valenceElectrons + 3 * slotB.valenceElectrons,
    ELECTRON_POOL.length,
  );
  const electrons = ELECTRON_POOL.slice(0, electronCount);

  const formula = homonuclear
    ? slotA.symbol
    : `${slotA.symbol} + ${slotB.symbol}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[9px] text-white/35 uppercase tracking-widest">Metallic Bond</span>

      {/* SVG diagram */}
      <div className="relative rounded-xl border border-white/10 bg-white/3 overflow-hidden" style={{ width: 200, height: 126 }}>
        <svg width={200} height={126} viewBox="0 0 200 126">
          {/* Metal cation cores */}
          {ION_POSITIONS.map((ion, i) => {
            const sym = symbols[ion.idx];
            const clr = CLRS[ion.idx];
            return (
              <g key={i}>
                <circle cx={ion.x} cy={ion.y} r={18} fill={clr} fillOpacity="0.12" stroke={clr} strokeOpacity="0.4" strokeWidth="1.5" />
                <text x={ion.x} y={ion.y + 5} textAnchor="middle" fill={clr} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  {sym}
                </text>
                <text x={ion.x + 13} y={ion.y - 10} fill={clr} fontSize="7" fontFamily="sans-serif" opacity="0.7">+</text>
              </g>
            );
          })}

          {/* Delocalised electrons — yellow to contrast with orange nuclei */}
          {electrons.map((e, i) => (
            <motion.circle
              key={i}
              cx={e.x0}
              cy={e.y0}
              r={4}
              fill="#fde047"
              fillOpacity="0.9"
              animate={{
                cx: [e.x0, e.x0 + e.dx, e.x0 + e.dx * 0.4, e.x0],
                cy: [e.y0, e.y0 + e.dy, e.y0 + e.dy * 0.7, e.y0],
              }}
              transition={{
                duration: 3 + (i % 3) * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.35,
              }}
            />
          ))}

          <text x={5} y={121} fill="rgba(253,224,71,0.6)" fontSize="8" fontFamily="sans-serif">e⁻ sea</text>
        </svg>
      </div>

      {/* Colour legend */}
      <div className="flex gap-4 text-[8px] text-white/50">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500" />
          Positive metal ion
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-300" />
          Delocalised e⁻
        </span>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xl font-bold text-white">{formula}</span>
        <span className="text-[9px] text-white/40 uppercase tracking-widest">
          {homonuclear ? 'Pure metal · metallic bond' : 'Alloy · metallic bond'}
        </span>
        <span className="text-[8px] text-white/30 text-center mt-1 max-w-[200px]">
          Electrostatic attraction holds positive metal ions and electrons together in metallic bonding.
        </span>
      </div>
    </div>
  );
}
