import type { ZoneState } from '../canvas/types';
import { gcd } from '../utils/gcd';

// IUPAC electronegativity order for binary covalent formulas — lower index written first
const IUPAC_ORDER: Record<string, number> = {
  B:1, Si:2, C:3, Sb:4, As:5, P:6, N:7, H:8,
  Te:9, Se:10, S:11, O:12, I:13, Br:14, Cl:15, F:16,
};

function iupacFirst(a: ZoneState, b: ZoneState): boolean {
  const pa = IUPAC_ORDER[a.symbol] ?? 0;
  const pb = IUPAC_ORDER[b.symbol] ?? 0;
  return pa <= pb; // a comes first when equal or lower priority index
}

const CLR_A = 'var(--color-cation)';
const CLR_B = 'var(--color-anion)';
const CLR_LP = 'rgba(200,210,255,0.75)';

function shellTarget(ve: number) { return ve <= 2 ? 2 : 8; }
function bondsNeeded(ve: number) { return Math.max(0, shellTarget(ve) - ve); }

function calcStoich(veA: number, veB: number): { nA: number; nB: number; bondOrder: number } {
  const bA = bondsNeeded(veA), bB = bondsNeeded(veB);
  if (!bA || !bB) return { nA: 1, nB: 1, bondOrder: 1 };
  const g = gcd(bA, bB);
  return { nA: bB / g, nB: bA / g, bondOrder: g };
}

// Lone pair dots: 2 dots side-by-side perpendicular to the given angle from (cx,cy)
function LonePairDot({ cx, cy, angle, r, color }: {
  cx: number; cy: number; angle: number; r: number; color: string;
}) {
  const d = r + 11;
  const x = cx + d * Math.cos(angle);
  const y = cy + d * Math.sin(angle);
  const px = -Math.sin(angle) * 3.5;
  const py =  Math.cos(angle) * 3.5;
  return (
    <>
      <circle cx={x - px} cy={y - py} r={2.5} fill={color} opacity="0.8" />
      <circle cx={x + px} cy={y + py} r={2.5} fill={color} opacity="0.8" />
    </>
  );
}

// Shared pair dots in the overlap between (cx1,cy1) and (cx2,cy2)
// bondOrder pairs, each pair = 2 dots (one per atom color)
function SharedPairs({ cx1, cy1, cx2, cy2, bondOrder, clr1, clr2 }: {
  cx1:number; cy1:number; cx2:number; cy2:number;
  bondOrder: number; clr1: string; clr2: string;
}) {
  const mx = (cx1 + cx2) / 2;
  const my = (cy1 + cy2) / 2;
  const dx = cx2 - cx1, dy = cy2 - cy1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len; // unit along bond
  const nx = -uy, ny = ux;            // unit perpendicular

  // Offset pairs along bond axis
  const step = 8;
  const start = -((bondOrder - 1) / 2) * step;

  return <>
    {Array.from({ length: bondOrder }, (_, i) => {
      const o = start + i * step;
      const bx = mx + ux * o, by = my + uy * o;
      return (
        <g key={i}>
          <circle cx={bx - nx * 3} cy={by - ny * 3} r={2.8} fill={clr1} opacity="0.9" />
          <circle cx={bx + nx * 3} cy={by + ny * 3} r={2.8} fill={clr2} opacity="0.9" />
        </g>
      );
    })}
  </>;
}

// Atom circle
function AtomCircle({ cx, cy, r, symbol, color }: {
  cx: number; cy: number; r: number; symbol: string; color: string;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r}
        fill={color} fillOpacity="0.10"
        stroke={color} strokeOpacity="0.55" strokeWidth="1.8" />
      <text x={cx} y={cy + 5} textAnchor="middle"
        fill={color} fontSize={r < 32 ? "11" : "13"} fontWeight="bold" fontFamily="sans-serif">
        {symbol}
      </text>
    </>
  );
}

// Given bond angles (pointing away from atom) and n lone pairs, return lone pair angles
function lonePairAngles(bondAngles: number[], nLone: number): number[] {
  if (nLone <= 0) return [];
  // Candidates: 8 directions at 45° steps
  const candidates = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  // Score each: higher score = farther from all bond angles
  const scored = candidates.map(a => {
    const minDist = bondAngles.reduce((min, ba) => {
      const diff = Math.abs(((a - ba + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
      return Math.min(min, diff);
    }, Math.PI);
    return { a, minDist };
  });
  scored.sort((x, y) => y.minDist - x.minDist);
  return scored.slice(0, nLone).map(s => s.a);
}

interface AtomData {
  symbol: string;
  ve: number;
  color: string;
  cx: number;
  cy: number;
  r: number;
  bondAngles: number[]; // angles pointing AWAY from this atom toward its bonds
}

function angleTo(x1: number, y1: number, x2: number, y2: number) {
  return Math.atan2(y2 - y1, x2 - x1);
}

interface Bond { a: number; b: number; } // indices into atoms array

interface Props {
  slotA: ZoneState;
  slotB: ZoneState;
}

export function CovalentView({ slotA, slotB }: Props) {
  const { nA, nB, bondOrder } = calcStoich(slotA.valenceElectrons, slotB.valenceElectrons);

  // Determine central (count=1) and peripheral (count>1)
  const centralIsA = nA <= nB;
  const central   = centralIsA ? slotA : slotB;
  const peripheral = centralIsA ? slotB : slotA;
  const centralColor   = centralIsA ? CLR_A : CLR_B;
  const peripheralColor = centralIsA ? CLR_B : CLR_A;
  const nPeripheral = centralIsA ? nB : nA;
  const nCentral    = centralIsA ? nA : nB;

  // Central lone pairs = ve_central - bondOrder * nPeripheral
  const centralLone = Math.max(0, Math.floor((central.valenceElectrons - bondOrder * nPeripheral) / 2));
  // Peripheral lone pairs = (ve_peripheral - bondOrder) / 2
  const peripheralLone = Math.max(0, Math.floor((peripheral.valenceElectrons - bondOrder) / 2));

  const rC = 42; // central atom radius
  const rP = nPeripheral === 1 ? 38 : 30; // peripheral radius
  const dCP = rC + rP - 16; // center-to-center distance (16px overlap)

  // Layout positions based on nPeripheral
  let W: number, H: number;
  let cxC: number, cyC: number;
  let peripheralPositions: Array<{ x: number; y: number }>;

  if (nPeripheral === 1) {
    W = 240; H = 120;
    cxC = W / 2 - dCP / 2; cyC = H / 2;
    peripheralPositions = [{ x: cxC + dCP, y: cyC }];
  } else if (nPeripheral === 2) {
    W = 330; H = 130;
    cxC = W / 2; cyC = H / 2;
    peripheralPositions = [
      { x: cxC - dCP, y: cyC },
      { x: cxC + dCP, y: cyC },
    ];
  } else if (nPeripheral === 3) {
    W = 300; H = 200;
    cxC = W / 2; cyC = H / 2;
    peripheralPositions = [
      { x: cxC - dCP,                               y: cyC },
      { x: cxC + dCP * Math.cos(Math.PI / 3),       y: cyC - dCP * Math.sin(Math.PI / 3) },
      { x: cxC + dCP * Math.cos(Math.PI / 3),       y: cyC + dCP * Math.sin(Math.PI / 3) },
    ];
  } else if (nPeripheral === 4) {
    W = 290; H = 290;
    cxC = W / 2; cyC = H / 2;
    peripheralPositions = [
      { x: cxC,       y: cyC - dCP },  // top
      { x: cxC + dCP, y: cyC       },  // right
      { x: cxC,       y: cyC + dCP },  // bottom
      { x: cxC - dCP, y: cyC       },  // left
    ];
  } else {
    // 5+: simplified two-atom view with count label
    W = 260; H = 130;
    cxC = W / 2 - dCP / 2; cyC = H / 2;
    peripheralPositions = [{ x: cxC + dCP, y: cyC }];
  }

  // Build atom data for bond angle calculation
  const centralBondAngles = peripheralPositions.map(p => angleTo(cxC, cyC, p.x, p.y));

  // Formula JSX — order by IUPAC electronegativity (less EN element first)
  const homonuclear = slotA.symbol === slotB.symbol;
  const aFirst = iupacFirst(slotA, slotB);
  const [fstSym, fstN, sndSym, sndN] = aFirst
    ? [slotA.symbol, nA, slotB.symbol, nB]
    : [slotB.symbol, nB, slotA.symbol, nA];
  const formulaEl = homonuclear ? (
    <>{slotA.symbol}{nA + nB > 1 && <sub>{nA + nB}</sub>}</>
  ) : (
    <>{fstSym}{fstN > 1 && <sub>{fstN}</sub>}{sndSym}{sndN > 1 && <sub>{sndN}</sub>}</>
  );

  const bondLabel = bondOrder === 1 ? 'Single' : bondOrder === 2 ? 'Double' : 'Triple';

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[9px] text-white/35 uppercase tracking-widest">Covalent Bond</span>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Draw all peripheral atoms and their bonds to central */}
        {peripheralPositions.map((p, i) => {
          const bondAngleFromPeripheral = angleTo(p.x, p.y, cxC, cyC); // toward central
          const lpAngles = lonePairAngles([bondAngleFromPeripheral], peripheralLone);
          return (
            <g key={i}>
              {/* Atom circle */}
              <AtomCircle cx={p.x} cy={p.y} r={rP} symbol={peripheral.symbol} color={peripheralColor} />
              {/* Lone pairs on peripheral */}
              {lpAngles.map((a, j) => (
                <LonePairDot key={j} cx={p.x} cy={p.y} angle={a} r={rP} color={CLR_LP} />
              ))}
              {/* Shared pairs in overlap with central */}
              <SharedPairs
                cx1={cxC} cy1={cyC} cx2={p.x} cy2={p.y}
                bondOrder={bondOrder}
                clr1={centralColor} clr2={peripheralColor}
              />
            </g>
          );
        })}

        {/* Central atom on top so it visually overlaps the peripheral circles */}
        <AtomCircle cx={cxC} cy={cyC} r={rC} symbol={central.symbol} color={centralColor} />
        {/* Lone pairs on central */}
        {lonePairAngles(centralBondAngles, centralLone).map((a, j) => (
          <LonePairDot key={j} cx={cxC} cy={cyC} angle={a} r={rC} color={CLR_LP} />
        ))}

        {/* Count badge when nPeripheral > 1 and we truncated */}
        {nPeripheral > 4 && (
          <text x={W - 10} y={15} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="9">
            ×{nPeripheral}
          </text>
        )}
      </svg>

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xl font-bold text-white">{formulaEl}</span>
        <span className="text-[9px] text-white/40 uppercase tracking-widest">
          {bondLabel} covalent bond · {bondOrder} shared pair{bondOrder > 1 ? 's' : ''} per bond
        </span>
      </div>
    </div>
  );
}
