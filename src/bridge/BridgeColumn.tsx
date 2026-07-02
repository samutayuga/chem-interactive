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
import { useWasm, useAllElements, usePolyatomicIons } from '../wasm/hooks';
import { classifyReaction, solveStoich } from '../wasm/chem';
import { ionicCompoundName, covalentCompoundName } from './compoundName';
import type { WasmReaction } from '@periodic-table';
import { StoichResultPanel } from '../stoich/StoichResultPanel';
import { ProductStateBadge, type ProductState } from '../stoich/ProductStateBadge';

const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
const toSub = (n: number) => String(n).split('').map(d => SUBSCRIPTS[+d]).join('');
const fmt = (sym: string, n: number) => (n > 1 ? `${sym}${toSub(n)}` : sym);

function EnterStoichButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1 rounded-full border border-accent/60 text-accent hover:bg-accent hover:text-bg transition-colors"
    >
      Stoichiometry →
    </button>
  );
}

/** Product subscripts (for the balanced equation) and a display formula string. */
function productInfo(
  reaction: WasmReaction | undefined, slotA: ZoneState, slotB: ZoneState,
): { subA: number; subB: number; formula: string } {
  if (reaction?.bonding === 'Covalent' && reaction.covalent) {
    const { n_a, n_b } = reaction.covalent;
    return { subA: n_a, subB: n_b, formula: fmt(slotA.symbol, n_a) + fmt(slotB.symbol, n_b) };
  }
  if (reaction?.bonding === 'Ionic') {
    const ca = Math.abs(slotA.derivedCharge ?? slotA.oxidationStates[0] ?? 1);
    const cb = Math.abs(slotB.derivedCharge ?? slotB.oxidationStates[0] ?? 1);
    const g = gcd(ca, cb) || 1;
    const subA = cb / g, subB = ca / g;
    const aPart = fmt(slotA.symbol, subA);
    const bPart = slotB.isPolyatomic && subB > 1 ? `(${slotB.symbol})${toSub(subB)}` : fmt(slotB.symbol, subB);
    return { subA, subB, formula: aPart + bPart };
  }
  const formula = slotA.symbol === slotB.symbol ? slotA.symbol : `${slotA.symbol}·${slotB.symbol}`;
  return { subA: 1, subB: 1, formula };
}

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
  // Use derivedCharge when available — correctly handles H⁺ acids and polyatomic anions
  if (slotA.derivedCharge !== null && slotB.derivedCharge !== null) {
    return slotA.derivedCharge > 0
      ? { cation: slotA, anion: slotB }
      : { cation: slotB, anion: slotA };
  }
  // Fallback for TM DEDUCING state
  const aCation = slotA.elementClass === 'Metal' || slotA.elementClass === 'Metalloid';
  return aCation ? { cation: slotA, anion: slotB } : { cation: slotB, anion: slotA };
}

export function BridgeColumn() {
  const { state, dispatch } = useIonicCanvas();
  const pt = useWasm();
  const elements = useAllElements();
  const ions = usePolyatomicIons();
  const { slotA, slotB, canvasPhase, bondingType } = state;

  const nameOf = (symbol: string) => elements.find(e => e.symbol === symbol)?.name ?? symbol;
  const ionNameOf = (symbol: string) => ions.find(i => i.symbol === symbol)?.name ?? symbol;

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
    <div className="w-full flex flex-col items-center justify-start gap-4">
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
              <span className="text-sm text-muted -mt-1">
                {ionicCompoundName(cation, anion, nameOf, ionNameOf)}
              </span>
              <BondingDiagram cation={cation} anion={anion} />
              <EnterStoichButton onClick={() => dispatch({ type: 'ENTER_STOICH' })} />
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
            <span className="text-sm text-muted -mt-1">
              {covalentCompoundName(slotA, slotB, nameOf)}
            </span>
            <EnterStoichButton onClick={() => dispatch({ type: 'ENTER_STOICH' })} />
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="text-xs px-3 py-1 rounded-full border border-muted/60 text-muted hover:border-accent hover:text-accent transition-colors"
            >
              Reset
            </button>
          </motion.div>
        )}

        {canvasPhase === 'STOICHIOMETRY' && slotA && slotB && (() => {
          const reaction = classifyReaction(pt, slotA.symbol, slotB.symbol);
          const { subA, subB, formula } = productInfo(reaction, slotA, slotB);
          const result = (state.quantityA && state.quantityB)
            ? solveStoich(pt,
                { symbol: slotA.symbol, subscript: subA, amount: state.quantityA.value, unit: state.quantityA.unit },
                { symbol: slotB.symbol, subscript: subB, amount: state.quantityB.value, unit: state.quantityB.unit })
            : undefined;
          return (
            <motion.div
              key="stoich"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 w-full"
            >
              {reaction && <ProductStateBadge state={reaction.product_state as ProductState} />}
              {!result && (
                <p className="text-xs text-muted text-center max-w-[200px]">
                  Tap the knob on each flask to set its amount (mol or g).
                </p>
              )}
              {result && (
                <StoichResultPanel symbolA={slotA.symbol} symbolB={slotB.symbol}
                  productFormula={formula} result={result} />
              )}
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                className="text-xs px-3 py-1 rounded-full border border-muted/60 text-muted hover:border-accent hover:text-accent transition-colors"
              >
                Reset
              </button>
            </motion.div>
          );
        })()}

        {isShowingMetallic && slotA && slotB && (
          <motion.div
            key="metallic"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <MetallicView slotA={slotA} slotB={slotB} />
            <EnterStoichButton onClick={() => dispatch({ type: 'ENTER_STOICH' })} />
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
