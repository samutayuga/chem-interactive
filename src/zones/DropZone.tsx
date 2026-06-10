import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { DeductionPanel } from './DeductionPanel';
import type { Side } from '../canvas/types';

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
  side: Side;
}

export function DropZone({ side }: Props) {
  const { state } = useIonicCanvas();
  const zone = side === 'cation' ? state.cation : state.anion;

  const isActiveDeduction = state.activeDeductionSide === side;
  const isLocked =
    state.activeDeductionSide !== null && state.activeDeductionSide !== side;

  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${side}`,
    disabled: isLocked || state.canvasPhase === 'ANIMATING_CROSSOVER' || state.canvasPhase === 'COMPLETE' || zone !== null,
  });

  const borderColor =
    side === 'cation' ? 'border-cation/40' : 'border-anion/40';
  const glowColor =
    side === 'cation' ? 'border-cation shadow-cation/20' : 'border-anion shadow-anion/20';
  const labelColor = side === 'cation' ? 'text-cation/50' : 'text-anion/50';

  return (
    <div
      ref={setNodeRef}
      className={[
        'flex-1 rounded-xl border-2 min-h-40 transition-all duration-200 overflow-hidden',
        isLocked ? 'opacity-40 pointer-events-none' : '',
        isOver ? `${glowColor} shadow-lg` : borderColor,
        isActiveDeduction ? glowColor : '',
      ].join(' ')}
    >
      <AnimatePresence mode="wait">
        {!zone && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center h-full min-h-40 ${labelColor} text-sm`}
          >
            Drop {side} here
          </motion.div>
        )}

        {zone && zone.status !== 'IONIZED' && (
          <motion.div
            key="deducing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className={`text-center py-3 text-2xl font-bold ${side === 'cation' ? 'text-cation' : 'text-anion'}`}>
              {zone.symbol}
            </div>
            <DeductionPanel side={side} zone={zone} />
          </motion.div>
        )}

        {zone && zone.status === 'IONIZED' && zone.derivedCharge !== null && (
          <motion.div
            key="ionized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center justify-center h-full min-h-40 text-3xl font-bold ${side === 'cation' ? 'text-cation' : 'text-anion'}`}
          >
            {formatIon(zone.symbol, zone.derivedCharge)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
