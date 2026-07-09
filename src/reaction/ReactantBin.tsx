import type { ZoneState } from '../canvas/types';
import type { ReactantEntry, QuantityUnit } from '../stoich/types';
import type { BinReactant } from './binReactant';
import { TransitionMetalPicker } from '../zones/TransitionMetalPicker';

interface Props {
  label: 'A' | 'B';
  species: ZoneState[];
  active: boolean;
  qty: ReactantEntry | null;
  compound: string | null;
  reactant: BinReactant | null;
  onActivate: () => void;
  onRemove: (index: number) => void;
  onPickCharge: (index: number, charge: number) => void;
  onQty: (entry: ReactantEntry | null) => void;
}

const MASS_HINT: Record<'Ar' | 'Mr', string> = {
  Ar: 'Ar — relative atomic mass (g/mol)',
  Mr: 'Mr — relative formula mass (g/mol)',
};

// Literal strings so Tailwind's JIT can see them.
const STYLE = {
  A: { border: 'border-2 border-cation', chip: 'bg-cation' },
  B: { border: 'border-2 border-anion',  chip: 'bg-anion'  },
} as const;

// Charge as a chemistry superscript: +1 → "⁺", −2 → "²⁻" (magnitude of 1 omitted).
const SUPERSCRIPTS: Record<number, string> = { 1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷' };
const chargeLabel = (c: number) => {
  const abs = Math.abs(c);
  const sign = c > 0 ? '⁺' : '⁻';
  return abs === 1 ? sign : `${SUPERSCRIPTS[abs] ?? abs}${sign}`;
};

export function ReactantBin({ label, species, active, qty, compound, reactant, onActivate, onRemove, onPickCharge, onQty }: Props) {
  const s = STYLE[label];
  return (
    <div
      onClick={onActivate}
      className={[
        'flex flex-col gap-1.5 rounded-lg bg-surface p-2.5 cursor-pointer transition-all',
        active ? s.border : 'border border-muted/40',
      ].join(' ')}
    >
      <div className="text-[11px] uppercase tracking-wide font-medium text-white/55">
        Reactant {label}{active && <span className="text-accent"> · active</span>}
      </div>

      <div className="flex gap-1.5 flex-wrap items-center">
        {species.length === 0 && <span className="text-xs text-white/40">tap tray to add (1–2 species)</span>}
        {compound != null ? (
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-bg ${s.chip}`}>
            {compound}
            <button
              aria-label="clear compound"
              onClick={e => { e.stopPropagation(); onRemove(-1); }}
              className="ml-0.5 text-bg/70 hover:text-bg"
            >×</button>
          </span>
        ) : (
          species.map((z, i) => (
            <span key={`${z.symbol}-${i}`} className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-bg ${s.chip}`}>
              {z.symbol}{z.derivedCharge != null ? chargeLabel(z.derivedCharge) : ''}
              <button
                aria-label={`remove ${z.symbol}`}
                onClick={e => { e.stopPropagation(); onRemove(i); }}
                className="ml-0.5 text-bg/70 hover:text-bg"
              >×</button>
            </span>
          ))
        )}
      </div>

      {reactant && (
        <div className="text-xs text-white/80" title={MASS_HINT[reactant.massKind]}>
          <span className="font-semibold text-white">{reactant.formula}</span>{' '}
          <span className="font-medium text-accent">{reactant.massKind}</span>{' '}
          {reactant.molarMass.toFixed(2)} g/mol
        </div>
      )}

      {species.map((z, i) =>
        z.isTransition && z.derivedCharge == null
          ? <TransitionMetalPicker key={`tm-${i}`} zone={z} onPick={c => onPickCharge(i, c)} />
          : null,
      )}

      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <input
          type="number"
          placeholder="qty (optional)"
          value={qty?.value ?? ''}
          onChange={e => onQty(e.target.value === '' ? null : { value: Number(e.target.value), unit: qty?.unit ?? 'mole' })}
          className="h-8 w-24 rounded bg-bg px-2 text-white text-sm placeholder:text-white/35 focus:ring-2 focus:ring-accent"
        />
        <select
          value={qty?.unit ?? 'mole'}
          onChange={e => { if (qty) onQty({ value: qty.value, unit: e.target.value as QuantityUnit }); }}
          className="h-8 rounded bg-bg px-2 text-white text-sm"
        >
          <option value="mole">mol</option>
          <option value="mass">g</option>
        </select>
      </div>
    </div>
  );
}
