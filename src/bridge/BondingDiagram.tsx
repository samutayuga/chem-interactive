import type { ZoneState } from '../canvas/types';
import { gcd } from '../utils/gcd';

// Electron dot positions: right, top, left, bottom, then paired
const DOT_OFFSETS: [number, number][] = [
  [22, 0], [0, -22], [-22, 0], [0, 22],
  [22, -8], [8, -22], [-22, -8], [-8, 22],
];

const C_CLR = 'var(--color-cation)';
const A_CLR = 'var(--color-anion)';

function supCharge(n: number): string {
  const abs = Math.abs(n);
  const sign = n > 0 ? '+' : '−';
  return abs === 1 ? sign : `${abs}${sign}`;
}

function AtomCircle({
  symbol, dots, charge, bracketed, color,
}: {
  symbol: string;
  dots: number;
  charge?: number;
  bracketed?: boolean;
  color: string;
}) {
  const r = 20, cx = 30, cy = 30;
  const bPad = bracketed ? 12 : 0;
  const W = 60 + bPad * 2;
  const scx = cx + bPad;
  const chg = charge != null && charge !== 0 ? supCharge(charge) : '';

  return (
    <svg width={W} height={60} viewBox={`0 0 ${W} 60`}>
      <circle cx={scx} cy={cy} r={r}
        fill={color} fillOpacity="0.08"
        stroke={color} strokeOpacity="0.45" strokeWidth="1.5" />

      {bracketed && <>
        <text x="1" y={cy + 8} fill="rgba(255,255,255,0.55)"
          fontSize="24" fontFamily="monospace" fontWeight="200">[</text>
        <text x={W - 9} y={cy + 8} fill="rgba(255,255,255,0.55)"
          fontSize="24" fontFamily="monospace" fontWeight="200">]</text>
      </>}

      <text x={scx} y={cy + 5} textAnchor="middle"
        fill={color} fontSize="13" fontWeight="bold" fontFamily="sans-serif">
        {symbol}
      </text>

      {chg && (
        <text
          x={bracketed ? W - 1 : scx + r + 3}
          y={bracketed ? cy - r + 2 : cy - r + 2}
          fill={color} fontSize="9" fontFamily="sans-serif">
          {chg}
        </text>
      )}

      {DOT_OFFSETS.slice(0, dots).map(([dx, dy], i) => (
        <circle key={i} cx={scx + dx} cy={cy + dy} r="2.5" fill={color} opacity="0.85" />
      ))}
    </svg>
  );
}

function Coeff({ n, color }: { n: number; color: string }) {
  if (n <= 1) return null;
  return (
    <span className="text-sm font-bold leading-none" style={{ color }}>
      {n}
    </span>
  );
}

function LewisTransferDiagram({ cation, anion }: { cation: ZoneState; anion: ZoneState }) {
  const cc = cation.derivedCharge!;
  const ac = anion.derivedCharge!;
  const g = gcd(Math.abs(cc), Math.abs(ac));
  const cCount = Math.abs(ac) / g;  // how many cations needed
  const aCount = Math.abs(cc) / g;  // how many anions needed
  const eMoved = Math.abs(cc);
  const anionAfterDots = Math.min(anion.valenceElectrons + Math.abs(ac), 8);

  return (
    <div className="flex flex-col items-center gap-1.5 w-full py-1">
      <span className="text-[8px] text-white/35 uppercase tracking-widest">Before</span>

      <div className="flex items-center gap-1 justify-center">
        <AtomCircle symbol={cation.symbol} dots={cation.valenceElectrons} color={C_CLR} />
        <span className="text-white/70 text-xs self-center">+</span>
        <AtomCircle symbol={anion.symbol} dots={anion.valenceElectrons} color={A_CLR} />
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[9px] text-cation/70">{eMoved}e⁻</span>
        <span className="text-white/75 text-base leading-none">→</span>
      </div>

      <span className="text-[8px] text-white/35 uppercase tracking-widest">After</span>

      <div className="flex items-center gap-1 justify-center">
        <div className="flex items-center gap-0.5">
          <Coeff n={cCount} color={C_CLR} />
          <AtomCircle symbol={cation.symbol} dots={0} charge={cc} color={C_CLR} />
        </div>
        <span className="text-white/70 text-xs self-center">+</span>
        <div className="flex items-center gap-0.5">
          <Coeff n={aCount} color={A_CLR} />
          <AtomCircle symbol={anion.symbol} dots={anionAfterDots} charge={ac} bracketed color={A_CLR} />
        </div>
      </div>

      <span className="text-[9px] text-white/45 uppercase tracking-widest font-semibold mt-1">
        Ionic Bond
      </span>
    </div>
  );
}

function SimpleIonDiagram({ cation, anion }: { cation: ZoneState; anion: ZoneState }) {
  const cc = cation.derivedCharge!;
  const ac = anion.derivedCharge!;
  const g = gcd(Math.abs(cc), Math.abs(ac));
  const cCount = Math.abs(ac) / g;
  const aCount = Math.abs(cc) / g;
  return (
    <div className="flex flex-col items-center gap-2 py-1">
      <div className="flex items-center gap-2 justify-center">
        <div className="flex items-center gap-0.5">
          <Coeff n={cCount} color={C_CLR} />
          <AtomCircle symbol={cation.symbol} dots={0} charge={cc} color={C_CLR} />
        </div>
        <span className="text-white/75 text-lg self-center">↔</span>
        <div className="flex items-center gap-0.5">
          <Coeff n={aCount} color={A_CLR} />
          <AtomCircle symbol={anion.symbol} dots={0} charge={ac} bracketed color={A_CLR} />
        </div>
      </div>
      <span className="text-[9px] text-white/45 uppercase tracking-widest font-semibold">
        Ionic Bond
      </span>
    </div>
  );
}

export function BondingDiagram({ cation, anion }: { cation: ZoneState; anion: ZoneState }) {
  const bothRegular = !cation.isPolyatomic && !anion.isPolyatomic;
  return bothRegular
    ? <LewisTransferDiagram cation={cation} anion={anion} />
    : <SimpleIonDiagram cation={cation} anion={anion} />;
}
