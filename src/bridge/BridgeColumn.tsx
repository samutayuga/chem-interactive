import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { CrossoverAnimator } from './CrossoverAnimator';
import { gcd } from '../utils/gcd';

function buildFormulaString(
  cSym: string, cSub: number,
  aSym: string, aSub: number,
  anionIsPolyatomic: boolean
): string {
  const cPart = cSub === 1 ? cSym : `${cSym}${cSub}`;
  const aPart = anionIsPolyatomic && aSub > 1
    ? `(${aSym})${aSub}`
    : aSub === 1 ? aSym : `${aSym}${aSub}`;
  return `${cPart}${aPart}`;
}

export function BridgeColumn() {
  const { state, dispatch } = useIonicCanvas();
  const { cation, anion, canvasPhase } = state;

  const isReadyToCross = canvasPhase === 'READY_TO_CROSS';
  const isAnimating    = canvasPhase === 'ANIMATING_CROSSOVER';
  const isComplete     = canvasPhase === 'COMPLETE';

  let formulaDisplay = '';
  if ((isComplete || isAnimating) && cation !== null && anion !== null && cation.derivedCharge !== null && anion.derivedCharge !== null) {
    const cCharge = Math.abs(cation.derivedCharge);
    const aCharge = Math.abs(anion.derivedCharge);
    const g = gcd(cCharge, aCharge);
    const cSub = aCharge / g;
    const aSub = cCharge / g;
    formulaDisplay = buildFormulaString(
      cation.symbol, cSub,
      anion.symbol, aSub,
      anion.isPolyatomic
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-2 min-w-24">
      <span className="text-2xl text-accent/60">⇌</span>

      <AnimatePresence mode="wait">
        {isReadyToCross && (
          <motion.button
            key="crossover-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'TRIGGER_CROSSOVER' })}
            className="px-3 py-2 rounded-xl border-2 border-accent bg-accent/20 text-accent text-xs font-bold hover:bg-accent/30 transition-colors shadow-lg shadow-accent/20"
          >
            Cross Over →
          </motion.button>
        )}

        {isAnimating && cation && anion && (
          <motion.div key="animator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            <CrossoverAnimator
              cation={cation}
              anion={anion}
              onComplete={() => dispatch({ type: 'CROSSOVER_COMPLETE' })}
            />
          </motion.div>
        )}

        {isComplete && (
          <motion.div
            key="formula"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-2xl font-bold text-white">{formulaDisplay}</span>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="text-xs px-3 py-1 rounded-full border border-muted/60 text-muted hover:border-accent hover:text-accent transition-colors"
            >
              Reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
