import type { ZoneState } from '../canvas/types';

interface Props {
  zone:      ZoneState;
  onConfirm: () => void;
}

function formatCharge(n: number): string {
  if (n === -1) return '−1';
  if (n < 0) return `−${Math.abs(n)}`;
  return `+${n}`;
}

export function PolyatomicConfirm({ zone, onConfirm }: Props) {
  const charge = zone.oxidationStates[0];
  return (
    <div className="flex flex-col gap-3 p-3 items-center">
      <p className="text-sm text-anion/80 text-center">
        {zone.symbol} carries a {formatCharge(charge!)} charge
      </p>
      <p className="text-xs text-white/80 text-center">
        Polyatomic ions are memorised as pre-charged units.
      </p>
      <button
        onClick={onConfirm}
        className="px-6 py-2 rounded-lg border border-anion/60 text-anion text-sm font-semibold hover:bg-anion/20 transition-colors"
      >
        Got it
      </button>
    </div>
  );
}
