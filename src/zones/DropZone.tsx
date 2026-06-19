import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
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
  const zone = slot === 'A' ? state.slotA : state.slotB;
  const { canvasPhase } = state;

  const dropDisabled = canvasPhase === 'ANIMATING_CROSSOVER' || canvasPhase === 'EXPLAINING';
  const showReplace  = zone !== null && canvasPhase !== 'ANIMATING_CROSSOVER';

  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${slot}`,
    disabled: dropDisabled,
  });

  const colors = SLOT_COLORS[slot];
  const hasPendingSelection = selectedElement !== null && !dropDisabled;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!selectedElement || dropDisabled) return;
    dispatch({ type: 'DROP_ELEMENT', slot, zone: selectedElement });
    clearSelection();
  }

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={[
        'relative w-full rounded-xl border-2 min-h-16 md:min-h-32 transition-all duration-200',
        isOver
          ? `${colors.glow} shadow-lg`
          : hasPendingSelection
            ? `${colors.glow} animate-pulse cursor-pointer`
            : colors.border,
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

      <AnimatePresence mode="wait">
        {!zone && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center py-2 md:py-4 ${colors.label} text-[10px] md:text-sm text-center px-1`}
          >
            {hasPendingSelection ? `Tap to place ${selectedElement.symbol}` : 'Drop here'}
          </motion.div>
        )}

        {zone && zone.status !== 'IONIZED' && (
          <motion.div
            key="filled"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className={`text-center py-2 md:py-3 text-lg md:text-2xl font-bold ${colors.text}`}>
              {zone.symbol}
            </div>
          </motion.div>
        )}

        {zone && zone.status === 'IONIZED' && zone.derivedCharge !== null && (
          <motion.div
            key="ionized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center justify-center py-2 md:py-4 text-xl md:text-3xl font-bold ${colors.text}`}
          >
            {formatIon(zone.symbol, zone.derivedCharge)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
