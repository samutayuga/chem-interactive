import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gcd } from '../utils/gcd';
import type { ZoneState } from '../canvas/types';

interface Props {
  cation:     ZoneState;
  anion:      ZoneState;
  onComplete: () => void;
}

type AnimStep = 0 | 1 | 2 | 3 | 4;

export function CrossoverAnimator({ cation, anion, onComplete }: Props) {
  const [step, setStep] = useState<AnimStep>(0);

  // Frame durations (ms): isolate=200, criss-cross=600, bracket=300, gcd=400
  const FRAME_MS: Record<number, number> = { 0: 200, 1: 600, 2: 300, 3: 400 };

  useEffect(() => {
    if (step >= 4) { onComplete(); return; }
    const t = setTimeout(() => advance(step + 1), FRAME_MS[step] ?? 400);
    return () => clearTimeout(t);
  }, [step]);

  const cCharge = Math.abs(cation.derivedCharge!);
  const aCharge = Math.abs(anion.derivedCharge!);

  const rawCationSub = aCharge;
  const rawAnionSub  = cCharge;
  const g            = gcd(rawCationSub, rawAnionSub);
  const finalCationSub = rawCationSub / g;
  const finalAnionSub  = rawAnionSub  / g;

  const showBrackets = anion.isPolyatomic && finalAnionSub > 1;
  const showGcd      = g > 1;

  const advance = (next: number) => {
    if (next === 2 && !showBrackets) { setStep(3); return; }
    if (next === 3 && !showGcd)      { setStep(4); return; }
    if (next >= 4) { onComplete(); return; }
    setStep(next as AnimStep);
  };

  const SUPERSCRIPTS: Record<number, string> = {1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷'};
  const sub = (n: number) => n === 1 ? '' : (SUPERSCRIPTS[n] ?? String(n));

  return (
    <div className="flex items-end justify-center gap-1 text-white select-none">
      {/* Always-present accessible test targets with raw integer subscript values */}
      <span data-testid="cation-sub" className="sr-only">{finalCationSub}</span>
      <span data-testid="anion-sub"  className="sr-only">{finalAnionSub}</span>
      <span data-testid="final-cation-sub" className="sr-only">{finalCationSub}</span>
      <span data-testid="final-anion-sub"  className="sr-only">{finalAnionSub}</span>

      <span className="text-3xl font-bold text-cation">{cation.symbol}</span>

      {finalCationSub > 1 && (
        <motion.span
          className="text-lg text-white self-end mb-0.5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : -20 }}
        >
          {sub(finalCationSub)}
        </motion.span>
      )}

      {showBrackets && (
        <motion.span
          data-testid="brackets"
          className="text-3xl text-anion"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : -20 }}
        >
          (
        </motion.span>
      )}

      <span className="text-3xl font-bold text-anion">{anion.symbol}</span>

      {showBrackets && (
        <motion.span
          className="text-3xl text-anion"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : -20 }}
        >
          )
        </motion.span>
      )}

      {finalAnionSub > 1 && (
        <motion.span
          className="text-lg text-white self-end mb-0.5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : -20 }}
        >
          {sub(finalAnionSub)}
        </motion.span>
      )}

      <AnimatePresence>
        {showGcd && step === 3 && (
          <motion.div
            className="absolute -top-6 text-xs text-yellow-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ÷{g}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
