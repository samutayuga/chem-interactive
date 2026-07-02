import { useState } from 'react';
import type { ReactantEntry, QuantityUnit } from './types';

interface Props {
  symbol: string;
  entry: ReactantEntry | null;
  onChange: (entry: ReactantEntry | null) => void;
}

export function ReactantQuantityPopover({ symbol, entry, onChange }: Props) {
  const [unit, setUnit] = useState<QuantityUnit>(entry?.unit ?? 'mole');
  const [text, setText] = useState(entry ? String(entry.value) : '');

  function emit(nextText: string, nextUnit: QuantityUnit) {
    const v = parseFloat(nextText);
    onChange(Number.isFinite(v) && v > 0 ? { value: v, unit: nextUnit } : null);
  }

  return (
    <div className="flex flex-col gap-2 w-[150px]">
      <label className="text-xs text-muted">{symbol} amount</label>
      <input
        type="number" inputMode="decimal" min="0" step="any" value={text}
        onChange={e => { setText(e.target.value); emit(e.target.value, unit); }}
        className="h-12 rounded bg-surface px-2 text-white outline-none focus:ring-2 focus:ring-accent"
      />
      <div className="flex gap-1">
        {(['mole', 'mass'] as QuantityUnit[]).map(u => (
          <button key={u} type="button"
            onClick={() => { setUnit(u); emit(text, u); }}
            className={`flex-1 rounded px-2 py-1 text-sm ${unit === u ? 'bg-accent text-bg' : 'bg-surface text-muted'}`}>
            {u === 'mole' ? 'mol' : 'g'}
          </button>
        ))}
      </div>
    </div>
  );
}
