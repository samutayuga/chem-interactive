import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useAllElements } from '../wasm/hooks';
import { useIonicCanvas } from '../canvas/hooks';
import { POLYATOMIC_IONS } from '../canvas/constants';
import { ElementToken, PolyatomicToken } from './ElementToken';
import { elementColor } from '../utils/elementColor';
import type { ElementClass } from '../canvas/types';

const N_PERIODS = 7;
const GROUP_COLUMNS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18] as const;
const PERIOD_ROWS = `repeat(${N_PERIODS}, 3.5rem)`;

function formatCategory(cat: string): string {
  return cat.replace(/([A-Z])/g, ' $1').trim();
}

type HighlightHint = 'ionic' | 'covalent' | 'metallic' | 'none' | null;

function bondHint(firstClass: ElementClass, elClass: ElementClass, category: string): HighlightHint {
  if (category === 'NobleGas') return 'none';
  if (firstClass === 'Metal' && elClass === 'Metal') return 'metallic';
  if (firstClass === 'NonMetal' && elClass === 'NonMetal') return 'covalent';
  if ((firstClass === 'Metalloid' || firstClass === 'NonMetal') &&
      (elClass === 'Metalloid' || elClass === 'NonMetal')) return 'covalent';
  return 'ionic';
}

const HINT_RING: Record<NonNullable<HighlightHint>, string> = {
  ionic:    'ring-2 ring-cyan-400/70',
  covalent: 'ring-2 ring-emerald-400/70',
  metallic: 'ring-2 ring-amber-400/70',
  none:     'opacity-20',
};

export function ElementTray() {
  const [tab, setTab] = useState<'elements' | 'polyatomic'>('elements');
  const [hoveredPeriod, setHoveredPeriod] = useState<number | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const all = useAllElements();
  const { state } = useIonicCanvas();

  const isDraggingDisabled = state.canvasPhase === 'ANIMATING_CROSSOVER'
    || state.canvasPhase === 'SHOWING_COVALENT'
    || state.canvasPhase === 'SHOWING_METALLIC';

  const slotAFilled = state.slotA !== null;
  const slotBFilled = state.slotB !== null;
  const bothFilled  = slotAFilled && slotBFilled;

  // Highlight only when exactly one slot filled
  const firstSlotClass: ElementClass | null =
    (!bothFilled && slotAFilled) ? state.slotA!.elementClass
    : (!bothFilled && slotBFilled) ? state.slotB!.elementClass
    : null;

  const isLanthanide = (z: number) => z >= 57 && z <= 71;
  const isActinide   = (z: number) => z >= 89 && z <= 103;
  const isFBlock     = (z: number) => isLanthanide(z) || isActinide(z);

  const mainEls     = all.filter(e => !isFBlock(e.atomic_number));
  const lanthanides = all.filter(e => isLanthanide(e.atomic_number)).sort((a, b) => a.atomic_number - b.atomic_number);
  const actinides   = all.filter(e => isActinide(e.atomic_number)).sort((a, b) => a.atomic_number - b.atomic_number);

  return (
    <div className="w-full h-full flex flex-col bg-surface/50 border-b border-muted/30 p-3">
      <div className="flex gap-2 mb-2 shrink-0">
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

        {/* Bonding legend — shown when first element dropped */}
        {firstSlotClass && (
          <div className="flex gap-3 items-center ml-4 text-[9px] text-white/50">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400/70 inline-block" />Ionic</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400/70 inline-block" />Covalent</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400/70 inline-block" />Metallic</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {tab === 'elements' && (
          <div className="flex flex-col gap-2 w-fit">

            {/* Main table */}
            <div className="flex items-start">
              {/* Period labels */}
              <div style={{ display: 'grid', gridTemplateRows: PERIOD_ROWS, gap: '2px' }} className="mr-1">
                {Array.from({ length: N_PERIODS }, (_, i) => i + 1).map(p => (
                  <Tooltip key={p} title={`Period ${p}`} placement="left" arrow enterDelay={200}>
                    <div
                      className={[
                        'flex items-center justify-center text-[9px] font-semibold cursor-default transition-colors duration-150 w-4',
                        hoveredPeriod === p ? 'text-white/80' : 'text-white/30',
                      ].join(' ')}
                    >
                      {p}
                    </div>
                  </Tooltip>
                ))}
              </div>

              {/* Group columns */}
              {GROUP_COLUMNS.map((group) => {
                const colEls = mainEls.filter(e => e.group === group);
                const firstEl = colEls[0];
                const category = firstEl ? formatCategory(firstEl.category) : `Group ${group}`;
                const color = firstEl ? elementColor(firstEl.category) : '#ffffff';
                const isHovered = hoveredGroup === group;

                return (
                  <Tooltip key={group} title={<><strong>Group {group}</strong> — {category}</>} placement="top" arrow enterDelay={200}>
                    <div
                      className="border border-transparent rounded-xl p-1 hover:border-white/25 transition-all duration-200 cursor-default"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '3.5rem',
                        gridTemplateRows: PERIOD_ROWS,
                        gap: '2px',
                        backgroundColor: color + (isHovered ? '28' : '12'),
                      }}
                      onMouseEnter={() => setHoveredGroup(group)}
                      onMouseLeave={() => setHoveredGroup(null)}
                    >
                      {/* Period row highlights */}
                      {Array.from({ length: N_PERIODS }, (_, i) => i + 1).map(p => (
                        <div
                          key={`row-${p}`}
                          style={{ gridColumn: 1, gridRow: p }}
                          className={[
                            'rounded-lg transition-colors duration-150 pointer-events-none',
                            hoveredPeriod === p ? 'bg-white/8' : '',
                          ].join(' ')}
                        />
                      ))}

                      {colEls.map(el => {
                        const hint = firstSlotClass
                          ? bondHint(firstSlotClass, el.class as ElementClass, el.category)
                          : null;
                        return (
                          <div
                            key={el.symbol}
                            style={{ gridColumn: 1, gridRow: el.period }}
                            className={hint ? HINT_RING[hint] : ''}
                            onMouseEnter={() => setHoveredPeriod(el.period)}
                            onMouseLeave={() => setHoveredPeriod(null)}
                          >
                            <ElementToken element={el} disabled={isDraggingDisabled} size="sm" />
                          </div>
                        );
                      })}
                    </div>
                  </Tooltip>
                );
              })}
            </div>

            {/* f-block */}
            {(lanthanides.length > 0 || actinides.length > 0) && (
              <div className="flex flex-col gap-1 pl-5">
                <div className="w-full h-px bg-white/10 mb-1" />

                {lanthanides.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-white/30 w-4 text-right shrink-0">6f</span>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${lanthanides.length}, 3.5rem)`, gap: '2px' }}>
                      {lanthanides.map(el => {
                        const hint = firstSlotClass
                          ? bondHint(firstSlotClass, el.class as ElementClass, el.category)
                          : null;
                        return (
                          <div key={el.symbol} className={hint ? HINT_RING[hint] : ''}>
                            <ElementToken element={el} disabled={isDraggingDisabled} size="sm" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {actinides.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-white/30 w-4 text-right shrink-0">7f</span>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${actinides.length}, 3.5rem)`, gap: '2px' }}>
                      {actinides.map(el => {
                        const hint = firstSlotClass
                          ? bondHint(firstSlotClass, el.class as ElementClass, el.category)
                          : null;
                        return (
                          <div key={el.symbol} className={hint ? HINT_RING[hint] : ''}>
                            <ElementToken element={el} disabled={isDraggingDisabled} size="sm" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {tab === 'polyatomic' && (
          <div className="flex gap-2 flex-wrap">
            {POLYATOMIC_IONS.map(ion => {
              const zoneFilled = slotAFilled && slotBFilled;
              return (
                <PolyatomicToken key={ion.symbol} ion={ion} disabled={isDraggingDisabled || zoneFilled} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
