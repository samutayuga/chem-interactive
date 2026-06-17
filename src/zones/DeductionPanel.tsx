import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { RegularDeduction } from './RegularDeduction';
import { TransitionMetalPicker } from './TransitionMetalPicker';
import { PolyatomicConfirm } from './PolyatomicConfirm';
import type { Slot, ZoneState } from '../canvas/types';

interface Props {
  slot: Slot;
  zone: ZoneState;
}

export function DeductionPanel({ slot, zone }: Props) {
  const { dispatch } = useIonicCanvas();

  const handleSubmit = (loseOrGain: 'lose' | 'gain', count: number) => {
    dispatch({ type: 'SUBMIT_DEDUCTION', slot, loseOrGain, count });
  };

  const handleTmPick = (charge: number) => {
    dispatch({ type: 'PICK_TM_CHARGE', slot, charge });
  };

  const handlePolyConfirm = () => {
    dispatch({ type: 'CONFIRM_POLYATOMIC', slot });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={zone.symbol}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        {zone.isPolyatomic ? (
          <PolyatomicConfirm zone={zone} onConfirm={handlePolyConfirm} />
        ) : zone.isTransition ? (
          <TransitionMetalPicker zone={zone} onPick={handleTmPick} />
        ) : (
          <RegularDeduction zone={zone} slot={slot} onSubmit={handleSubmit} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
