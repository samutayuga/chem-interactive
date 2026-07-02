import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { useClassify, useWasm } from '../wasm/hooks';
import { productStateAt } from '../wasm/chem';
import { PotionFlask, type FlaskState } from './PotionFlask';
import { ReactantQuantityPopover } from '../stoich/ReactantQuantityPopover';
import { elementClassColor } from '../utils/elementColor';
import type { Slot } from '../canvas/types';

const SUPERSCRIPTS: Record<number, string> = {
  1:'¹', 2:'²', 3:'³', 4:'⁴', 5:'⁵', 6:'⁶', 7:'⁷',
};

function formatIon(symbol: string, charge: number): string {
  const abs = Math.abs(charge);
  const sign = charge > 0 ? '⁺' : '⁻';
  const sup = abs === 1 ? sign : `${SUPERSCRIPTS[abs] ?? abs}${sign}`;
  return `${symbol}${sup}`;
}

interface Props {
  slot: Slot;
}

const SLOT_COLORS: Record<Slot, { border: string; glow: string; label: string; text: string }> = {
  A: { border: 'border-cation/40', glow: 'border-cation shadow-cation/20', label: 'text-cation/80', text: 'text-cation' },
  B: { border: 'border-anion/40',  glow: 'border-anion shadow-anion/20',   label: 'text-anion/80',  text: 'text-anion'  },
};

export function DropZone({ slot }: Props) {
  const { state, dispatch, selectedElement, clearSelection } = useIonicCanvas();
  const classify = useClassify();
  const pt = useWasm();
  const zone = slot === 'A' ? state.slotA : state.slotB;
  const flaskState: FlaskState | null = zone
    ? (zone.isPolyatomic ? 'Aqueous' : (productStateAt(pt, zone.symbol, 298) as FlaskState | undefined) ?? 'Solid')
    : null;
  const { canvasPhase } = state;

  const dropDisabled = canvasPhase === 'ANIMATING_CROSSOVER' || canvasPhase === 'EXPLAINING';
  const showReplace  = zone !== null && canvasPhase !== 'ANIMATING_CROSSOVER';

  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${slot}`,
    disabled: dropDisabled,
  });

  const colors = SLOT_COLORS[slot];
  const accent = slot === 'A' ? 'var(--color-cation)' : 'var(--color-anion)';
  const hasPendingSelection = selectedElement !== null && !dropDisabled;

  const settingQuantity = canvasPhase === 'STOICHIOMETRY' && zone !== null;
  const quantity = slot === 'A' ? state.quantityA : state.quantityB;
  const [showQuantity, setShowQuantity] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!selectedElement || dropDisabled) return;
    dispatch({ type: 'DROP_ELEMENT', slot, zone: selectedElement, classify });
    clearSelection();
  }

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={[
        'relative w-full rounded-xl min-h-44 transition-all duration-200 flex items-center justify-center',
        hasPendingSelection ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      {showReplace && (
        <button
          onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REPLACE_ELEMENT', slot }); }}
          aria-label={`Replace ${slot === 'A' ? 'left' : 'right'} element`}
          className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/30 text-white/40 hover:text-red-400 text-xs flex items-center justify-center transition-colors"
        >
          ×
        </button>
      )}

      {/* Potion flask is the vessel in every state — empty zones show an
          empty flask (no fill) tinted by the slot accent. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <PotionFlask
          key={zone?.symbol ?? 'empty'}
          state={flaskState ?? 'Solid'}
          fill={zone ? 0.6 : 0}
          color={zone ? elementClassColor(zone.elementClass) : accent}
          highlighted={isOver || hasPendingSelection}
        />
      </div>

      {/* Stoichiometry: a knob on the flask neck opens the quantity popup. */}
      {settingQuantity && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowQuantity(true); }}
          aria-label={`Set ${slot === 'A' ? 'left' : 'right'} reactant quantity`}
          className={`absolute top-1 left-1/2 -translate-x-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center shadow-md ring-1 ring-white/75 ${colors.text} bg-surface hover:brightness-125 transition`}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" /><circle cx="9" cy="7" r="2" fill="currentColor" />
            <line x1="4" y1="17" x2="20" y2="17" /><circle cx="15" cy="17" r="2" fill="currentColor" />
          </svg>
        </button>
      )}

      {settingQuantity && showQuantity && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={(e) => { e.stopPropagation(); setShowQuantity(false); }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-9 left-1/2 -translate-x-1/2 z-40 rounded-lg bg-bg/95 border border-white/15 p-3 shadow-xl backdrop-blur"
          >
            <ReactantQuantityPopover
              symbol={zone!.symbol}
              entry={quantity}
              onChange={(e) => dispatch({ type: 'SET_QUANTITY', slot, entry: e })}
            />
            <button
              onClick={() => setShowQuantity(false)}
              className={`mt-2 w-full rounded px-2 py-1 text-sm bg-surface ${colors.text} hover:brightness-125`}
            >
              Done
            </button>
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {!zone && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label={hasPendingSelection ? `Tap to place ${selectedElement.symbol}` : 'Drop here'}
            className={`pointer-events-none absolute inset-x-0 top-[62%] -translate-y-1/2 z-10 flex flex-col items-center justify-center gap-0.5 ${colors.text}`}
          >
            {hasPendingSelection ? (
              <>
                <span className="text-sm md:text-lg font-bold leading-none">{selectedElement.symbol}</span>
                <motion.svg
                  viewBox="0 0 24 24" width="18" height="18" fill="none"
                  stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path d="M12 4v11" /><path d="M7 11l5 5 5-5" />
                </motion.svg>
              </>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" opacity="0.65">
                <path d="M12 2.5l1.7 4.9 4.9 1.7-4.9 1.7L12 15.7l-1.7-4.9L5.4 9.1l4.9-1.7z" />
                <circle cx="18.5" cy="17" r="1.5" /><circle cx="6" cy="16" r="1.1" />
              </svg>
            )}
          </motion.div>
        )}

        {zone && zone.status !== 'IONIZED' && (
          <motion.div
            key="filled"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="pointer-events-none absolute inset-x-0 top-[62%] -translate-y-1/2 z-10 flex items-center justify-center"
          >
            <div className={`text-center text-lg md:text-2xl font-bold ${colors.text}`}>
              {zone.symbol}
            </div>
            {settingQuantity && quantity && (
              <div className="text-center text-[11px] md:text-xs font-semibold text-white">
                {quantity.value} {quantity.unit === 'mole' ? 'mol' : 'g'}
              </div>
            )}
          </motion.div>
        )}

        {zone && zone.status === 'IONIZED' && zone.derivedCharge !== null && (
          <motion.div
            key="ionized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`pointer-events-none absolute inset-x-0 top-[62%] -translate-y-1/2 z-10 flex items-center justify-center text-xl md:text-3xl font-bold ${colors.text}`}
          >
            {formatIon(zone.symbol, zone.derivedCharge)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
