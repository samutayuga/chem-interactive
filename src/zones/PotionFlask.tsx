export type FlaskState = 'Solid' | 'Liquid' | 'Gas' | 'Aqueous';

interface Props {
  state: FlaskState;
  fill: number;
  label?: string;
}

// Proportions adapted from the iOS PotionFlask.swift on a 100×140 viewBox:
// narrow lip + neck flaring into a round bulb.
const FLASK_PATH =
  'M40 4 H60 L57 40 Q92 66 92 92 Q92 135 50 135 Q8 135 8 92 Q8 66 43 40 Z';

const FILL_COLOR: Record<FlaskState, string> = {
  Solid: 'var(--color-accent, #7c5cff)',
  Liquid: 'var(--color-anion, #4aa3ff)',
  Aqueous: 'var(--color-anion, #4aa3ff)',
  Gas: 'var(--color-cation, #ff6b6b)',
};

export function PotionFlask({ state, fill, label }: Props) {
  const clamped = Math.max(0, Math.min(1, fill));
  const top = 135 - 130 * clamped; // fill rises from the bottom (y≈135) upward

  return (
    <svg viewBox="0 0 100 140" data-state={state} className="h-40 w-32">
      <defs>
        <clipPath id="flask-clip"><path d={FLASK_PATH} /></clipPath>
      </defs>
      {state === 'Gas' ? (
        <rect x="0" y="0" width="100" height="140"
          fill={FILL_COLOR[state]} opacity={0.12} clipPath="url(#flask-clip)" />
      ) : (
        <rect x="0" y={top} width="100" height={140 - top}
          fill={FILL_COLOR[state]} opacity={state === 'Solid' ? 0.7 : 0.55}
          clipPath="url(#flask-clip)" />
      )}
      <path d={FLASK_PATH} fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
      {label && (
        <text x="50" y="96" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{label}</text>
      )}
    </svg>
  );
}
