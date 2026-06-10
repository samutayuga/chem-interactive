import type { ZoneState } from '../canvas/types';

const SUPERSCRIPTS: Record<number, string> = { 1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷' };

interface Props {
  zone:   ZoneState;
  onPick: (charge: number) => void;
}

export function TransitionMetalPicker({ zone, onPick }: Props) {
  const positiveStates = zone.oxidationStates.filter(s => s > 0);

  return (
    <div className="flex flex-col gap-3 p-3">
      <p className="text-xs text-yellow-300 text-center font-semibold">
        Transition metal — pick its charge:
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        {positiveStates.map(charge => (
          <button
            key={charge}
            onClick={() => onPick(charge)}
            className="px-4 py-2 rounded-lg border border-yellow-500/60 text-yellow-300 text-sm font-bold hover:bg-yellow-500/20 transition-colors"
          >
            {zone.symbol}{SUPERSCRIPTS[charge] ?? charge}+
          </button>
        ))}
      </div>
    </div>
  );
}
