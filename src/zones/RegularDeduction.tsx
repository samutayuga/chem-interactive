import { useState } from 'react';
import { motion } from 'framer-motion';
import Tooltip from '@mui/material/Tooltip';
import type { ZoneState, Slot } from '../canvas/types';

function LoseIcon() {
  return (
    <svg width="48" height="32" viewBox="0 0 48 32">
      <circle cx="10" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      <line x1="19" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="30,12 37,16 30,20" fill="currentColor" opacity="0.9" />
      <circle cx="43" cy="16" r="4" fill="currentColor" opacity="0.9" />
      <text x="43" y="19" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">e</text>
    </svg>
  );
}

function GainIcon() {
  return (
    <svg width="48" height="32" viewBox="0 0 48 32">
      <circle cx="5" cy="16" r="4" fill="currentColor" opacity="0.9" />
      <text x="5" y="19" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">e</text>
      <line x1="10" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="20,12 27,16 20,20" fill="currentColor" opacity="0.9" />
      <circle cx="38" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
}

interface Props {
  zone:     ZoneState;
  slot:     Slot;
  onSubmit: (loseOrGain: 'lose' | 'gain', count: number) => void;
}

export function RegularDeduction({ zone, slot, onSubmit }: Props) {
  const [direction, setDirection] = useState<'lose' | 'gain' | null>(null);
  const [shake, setShake] = useState(false);

  const prevWrongCount = useState(zone.wrongCount)[0];
  if (zone.wrongCount > prevWrongCount && !shake) setShake(true);

  const handleCount = (count: number) => {
    if (!direction) return;
    onSubmit(direction, count);
    setDirection(null);
  };

  const accentCls = slot === 'A'
    ? 'border-cation bg-cation/20 text-cation shadow-lg scale-105'
    : 'border-anion bg-anion/20 text-anion shadow-lg scale-105';

  return (
    <motion.div
      animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
      transition={{ duration: 0.35 }}
      onAnimationComplete={() => setShake(false)}
    >
    <div className="flex flex-col gap-3 p-3">
      <p className="text-xs text-white/80 text-center">
        To achieve a stable octet, this atom must:
      </p>

      <div className="flex gap-3 justify-center">
        {([
          { d: 'lose', label: 'Lose electrons (donate)', Icon: LoseIcon },
          { d: 'gain', label: 'Gain electrons (accept)', Icon: GainIcon },
        ] as const).map(({ d, label, Icon }) => {
          const selected = direction === d;
          return (
            <Tooltip key={d} title={label} placement="top" arrow enterDelay={200}>
              <button
                onClick={() => setDirection(d)}
                className={[
                  'w-16 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-150',
                  selected ? accentCls : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white/90',
                ].join(' ')}
              >
                <Icon />
              </button>
            </Tooltip>
          );
        })}
      </div>

      <p className="text-xs text-white/80 text-center">How many electrons?</p>

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
                : 'border-white/20 text-white/30 cursor-not-allowed',
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
