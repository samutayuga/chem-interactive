import { useState } from 'react';
import { useAllElements } from '../wasm/hooks';
import { useIonicCanvas } from '../canvas/hooks';
import { POLYATOMIC_IONS } from '../canvas/constants';
import { ElementToken, PolyatomicToken } from './ElementToken';

const DISPLAY_ELEMENTS = [
  'H','Li','Be','B','C','N','O','F',
  'Na','Mg','Al','Si','P','S','Cl',
  'K','Ca','Fe','Cu','Zn','Ag','Pb',
];

export function ElementTray() {
  const [tab, setTab] = useState<'elements' | 'polyatomic'>('elements');
  const all = useAllElements();
  const { state } = useIonicCanvas();

  const displayed = all.filter(e => DISPLAY_ELEMENTS.includes(e.symbol));
  const isDraggingDisabled = state.canvasPhase === 'DEDUCING_CHARGE' || state.canvasPhase === 'ANIMATING_CROSSOVER';
  const cationFilled = state.cation !== null;
  const anionFilled  = state.anion  !== null;

  return (
    <div className="w-full bg-surface/50 border-b border-muted/30 p-3">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setTab('elements')}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            tab === 'elements' ? 'border-accent bg-accent/20 text-accent' : 'border-muted/40 text-muted'
          }`}
        >
          Elements
        </button>
        <button
          onClick={() => setTab('polyatomic')}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            tab === 'polyatomic' ? 'border-accent bg-accent/20 text-accent' : 'border-muted/40 text-muted'
          }`}
        >
          Polyatomic Ions
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tab === 'elements' && displayed.map(el => (
          <ElementToken
            key={el.symbol}
            element={el}
            disabled={isDraggingDisabled}
          />
        ))}
        {tab === 'polyatomic' && POLYATOMIC_IONS.map(ion => {
          const zoneFilled = ion.charge > 0 ? cationFilled : anionFilled;
          return (
            <PolyatomicToken
              key={ion.symbol}
              ion={ion}
              disabled={isDraggingDisabled || zoneFilled}
            />
          );
        })}
      </div>
    </div>
  );
}
