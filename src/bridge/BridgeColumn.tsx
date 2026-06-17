import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { CrossoverAnimator } from './CrossoverAnimator';
import { BondingDiagram } from './BondingDiagram';
import { CovalentView } from './CovalentView';
import { MetallicView } from './MetallicView';
import { ExplanationModal } from './ExplanationModal';
import { gcd } from '../utils/gcd';
import type { ZoneState } from '../canvas/types';

function buildFormulaJsx(
  cSym: string, cSub: number,
  aSym: string, aSub: number,
  anionIsPolyatomic: boolean
): ReactNode {
  return (
    <>
      {cSym}{cSub > 1 && <sub>{cSub}</sub>}
      {anionIsPolyatomic && aSub > 1 ? <>({aSym})<sub>{aSub}</sub></> : <>{aSym}{aSub > 1 && <sub>{aSub}</sub>}</>}
    </>
  );
}

function ionicPair(slotA: ZoneState, slotB: ZoneState): { cation: ZoneState; anion: ZoneState } {
  const aCation = slotA.elementClass === 'Metal' || slotA.elementClass === 'Metalloid';
  return aCation ? { cation: slotA, anion: slotB } : { cation: slotB, anion: slotA };
}

export function BridgeColumn() {
  const { state, dispatch } = useIonicCanvas();
  const { slotA, slotB, canvasPhase, bondingType } = state;

  const isAnimating       = canvasPhase === 'ANIMATING_CROSSOVER';
  const isCompleteIonic   = canvasPhase === 'COMPLETE' && bondingType === 'Ionic';
  const isShowingCovalent = canvasPhase === 'SHOWING_COVALENT';
  const isShowingMetallic = canvasPhase === 'SHOWING_METALLIC';

  let formulaDisplay: ReactNode = null;
  if (isCompleteIonic && slotA && slotB && slotA.derivedCharge !== null && slotB.derivedCharge !== null) {
    const { cation, anion } = ionicPair(slotA, slotB);
    const cCharge = Math.abs(cation.derivedCharge!);
    const aCharge = Math.abs(anion.derivedCharge!);
    const g = gcd(cCharge, aCharge);
    formulaDisplay = buildFormulaJsx(
      cation.symbol, aCharge / g,
      anion.symbol,  cCharge / g,
      anion.isPolyatomic
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-2 min-w-52">
      <span className="text-2xl text-accent/60">⇌</span>

      {canvasPhase === 'EXPLAINING' && <ExplanationModal />}

      <AnimatePresence mode="wait">

        {isAnimating && slotA && slotB && (() => {
          const { cation, anion } = ionicPair(slotA, slotB);
          return (
            <motion.div key="animator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
              <CrossoverAnimator
                cation={cation}
                anion={anion}
                onComplete={() => dispatch({ type: 'CROSSOVER_COMPLETE' })}
              />
            </motion.div>
          );
        })()}

        {isCompleteIonic && slotA && slotB && (() => {
          const { cation, anion } = ionicPair(slotA, slotB);
          return (
            <motion.div
              key="formula"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-2xl font-bold text-white">{formulaDisplay}</span>
              <BondingDiagram cation={cation} anion={anion} />
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                className="text-xs px-3 py-1 rounded-full border border-muted/60 text-muted hover:border-accent hover:text-accent transition-colors"
              >
                Reset
              </button>
            </motion.div>
          );
        })()}

        {isShowingCovalent && slotA && slotB && (
          <motion.div
            key="covalent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <CovalentView slotA={slotA} slotB={slotB} />
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="text-xs px-3 py-1 rounded-full border border-muted/60 text-muted hover:border-accent hover:text-accent transition-colors"
            >
              Reset
            </button>
          </motion.div>
        )}

        {isShowingMetallic && slotA && slotB && (
          <motion.div
            key="metallic"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <MetallicView slotA={slotA} slotB={slotB} />
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
