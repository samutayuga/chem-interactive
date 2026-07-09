import type { ZoneState } from '../canvas/types';
import type { ReactantEntry, QuantityUnit } from '../stoich/types';
import { TransitionMetalPicker } from '../zones/TransitionMetalPicker';

interface Props {
  label: 'A' | 'B';
  species: ZoneState[];
  active: boolean;
  qty: ReactantEntry | null;
  compound: string | null;
  onActivate: () => void;
  onRemove: (index: number) => void;
  onPickCharge: (index: number, charge: number) => void;
  onQty: (entry: ReactantEntry | null) => void;
}

// Literal strings so Tailwind's JIT can see them.
const STYLE = {
  A: { border: 'border-2 border-cation', chip: 'bg-cation' },
  B: { border: 'border-2 border-anion',  chip: 'bg-anion'  },
} as const;

const chargeLabel = (c: number) => `${c > 0 ? '+' : ''}${c}`;

export function ReactantBin({ label, species, active, qty, compound, onActivate, onRemove, onPickCharge, onQty }: Props) {
  const s = STYLE[label];
  return (
    <div
      onClick={onActivate}
      className={[
        'flex flex-col gap-2 rounded-lg bg-surface p-3 min-h-24 cursor-pointer transition-all',
        active ? s.border : 'border border-muted/40',
      ].join(' ')}
    >
      <div className="text-xs text-muted">Reactant {label}{active ? ' (active)' : ''}</div>

      <div className="flex gap-2 flex-wrap min-h-8 items-center">
        {species.length === 0 && <span className="text-xs text-white/30">tap tray to add (1–2 species)</span>}
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
          className="h-9 w-28 rounded bg-bg px-2 text-white text-sm focus:ring-2 focus:ring-accent"
        />
        <select
          value={qty?.unit ?? 'mole'}
          onChange={e => { if (qty) onQty({ value: qty.value, unit: e.target.value as QuantityUnit }); }}
          className="h-9 rounded bg-bg px-2 text-white text-sm"
        >
          <option value="mole">mol</option>
          <option value="mass">g</option>
        </select>
      </div>
    </div>
  );
}
