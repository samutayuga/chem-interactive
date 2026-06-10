import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ZoneState, Side } from '../canvas/types';

interface Props {
  zone:     ZoneState;
  side:     Side;
  onSubmit: (loseOrGain: 'lose' | 'gain', count: number) => void;
}

export function RegularDeduction({ zone, side, onSubmit }: Props) {
  const [direction, setDirection] = useState<'lose' | 'gain' | null>(null);
  const [shake, setShake] = useState(false);

  const prevWrongCount = useState(zone.wrongCount)[0];
  if (zone.wrongCount > prevWrongCount && !shake) setShake(true);

  const handleCount = (count: number) => {
    if (!direction) return;
    onSubmit(direction, count);
    setDirection(null);
  };

  return (
    <motion.div
      animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
      transition={{ duration: 0.35 }}
      onAnimationComplete={() => setShake(false)}
    >
    <div className="flex flex-col gap-3 p-3">
      <p className="text-xs text-muted text-center">
        To achieve a stable octet, this atom must:
      </p>

      <div className="flex gap-2">
        {(['lose', 'gain'] as const).map(d => {
          const selected = direction === d;
          const selectedCls = side === 'cation'
            ? 'border-cation bg-cation text-[#1a0a2e] shadow-lg scale-105'
            : 'border-anion bg-anion text-[#1a0a2e] shadow-lg scale-105';
          return (
            <button
              key={d}
              onClick={() => setDirection(d)}
              className={[
                'flex-1 py-2 rounded-lg border text-sm font-semibold capitalize transition-all duration-150',
                selected ? selectedCls : 'border-muted/40 text-muted hover:border-accent/60 hover:text-white',
              ].join(' ')}
            >
              {d}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted text-center">How many electrons?</p>

      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4].map(n => (
          <button
            key={n}
            onClick={() => handleCount(n)}
            disabled={!direction}
            className={[
              'w-10 h-10 rounded-lg border text-sm font-bold transition-colors',
              direction
                ? 'border-accent/60 text-white hover:border-accent hover:bg-accent/20'
                : 'border-muted/20 text-muted/40 cursor-not-allowed',
            ].join(' ')}
          >
            {n}
          </button>
        ))}
      </div>

      {zone.wrongCount >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-center text-yellow-300 bg-yellow-900/30 rounded-lg p-2"
        >
          Hint: {zone.symbol} has {zone.valenceElectrons} valence electron{zone.valenceElectrons !== 1 ? 's' : ''}.
        </motion.div>
      )}
    </div>
    </motion.div>
  );
}
