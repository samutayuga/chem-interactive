import { motion } from 'framer-motion';

export type FlaskState = 'Solid' | 'Liquid' | 'Gas' | 'Aqueous';

interface Props {
  state: FlaskState;
  fill?: number;
  /** Fill/contents tint. Defaults to a per-state color when omitted. */
  color?: string;
  /** Brightens the glow halo and outline when the zone is targeted/selectable. */
  highlighted?: boolean;
  label?: string;
}

// Exact port of iOS PotionFlaskShape.swift on a 100×140 viewBox (same ratios):
// lipHalf .16w, neckHalf .11w, lipTopY .03h, rimY .07h, neckBottomY .40h,
// bulbCenterY .66h, bulbRx .40w, bulbRy .30h, bottomY .97h, flare ctrl +.07h.
const FLASK_PATH =
  'M34 4.2 L39 9.8 L39 56 ' +
  'C39 65.8 10 50.4 10 92.4 ' +
  'C10 134.4 30 135.8 50 135.8 ' +
  'C70 135.8 90 134.4 90 92.4 ' +
  'C90 50.4 61 65.8 61 56 ' +
  'L61 9.8 L66 4.2 Z';

const W = 100, H = 140;

// Fallback fill color per state (used when no explicit `color` is passed).
const STATE_COLOR: Record<FlaskState, string> = {
  Solid:   'var(--color-accent, #7c5cff)',
  Liquid:  'var(--color-anion, #4aa3ff)',
  Aqueous: 'var(--color-anion, #4aa3ff)',
  Gas:     'var(--color-cation, #ff6b6b)',
};

// Port of WaveTop.swift: lower `fill` fraction filled, gentle static sine top edge.
function wavePath(fill: number): string {
  const clamped = Math.max(0, Math.min(1, fill));
  const surfaceY = H - H * clamped;
  const amp = H * 0.03;
  const midY = surfaceY + amp;
  const steps = 24;
  let d = `M0 ${midY.toFixed(2)}`;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = W * t;
    const y = surfaceY + amp * Math.sin(t * 2 * Math.PI);
    d += ` L${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += ` L${W} ${H} L0 ${H} Z`;
  return d;
}

// Port of PotionBubbles.swift: 7 bubbles rising through the bulb, fading out.
const POTION_BUBBLES = Array.from({ length: 7 }, (_, i) => {
  const baseX = 0.32 + 0.36 * (((i * 53) % 100) / 100);
  return {
    x: W * baseX,
    r: 1.6 + (i % 3),
    period: 3 + (i % 4) * 0.6,
    delay: i * 0.17 * (3 + (i % 4) * 0.6),
  };
});

// Port of the gasLayer bubbles: 10 bubbles rising bottom → top.
const GAS_BUBBLES = Array.from({ length: 10 }, (_, i) => {
  const x = W * (0.15 + 0.7 * (((i * 37) % 100) / 100));
  return {
    x,
    r: 2 + (i % 3),
    period: 2.5 + (i % 3) * 0.7,
    delay: i * 0.13 * (2.5 + (i % 3) * 0.7),
  };
});

// Aqueous dispersing dots (dissolution puff).
const AQUEOUS_DOTS = [
  { x: 0.3, y: 0.55 }, { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.6 },
  { x: 0.4, y: 0.65 }, { x: 0.6, y: 0.45 },
].map((d) => ({ x: W * d.x, y: H * d.y }));

export function PotionFlask({ state, fill = 0.6, color, highlighted = false, label }: Props) {
  const tint = color ?? STATE_COLOR[state];
  const bubbleColor = color ?? STATE_COLOR[state];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} data-state={state} className="h-40 w-32 overflow-visible">
      <defs>
        <clipPath id="flask-clip"><path d={FLASK_PATH} /></clipPath>
        <filter id="flask-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={highlighted ? 5 : 3.2} />
        </filter>
      </defs>

      {/* Soft glow halo behind the bulb. */}
      <path
        d={FLASK_PATH}
        fill={tint}
        opacity={highlighted ? 0.28 : 0.12}
        filter="url(#flask-glow)"
      />

      {/* State-appropriate animated fill, clipped to the flask. */}
      <g clipPath="url(#flask-clip)">
        {state === 'Solid' && (
          <motion.rect
            x="6" width="88" rx="4"
            fill={tint} opacity={0.7}
            initial={{ y: -H * fill, height: H * fill }}
            animate={{ y: H - H * fill, height: H * fill }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          />
        )}

        {(state === 'Liquid' || state === 'Aqueous') && (
          <motion.path
            fill={tint} fillOpacity={0.55}
            initial={{ d: wavePath(0) }}
            animate={{ d: wavePath(fill) }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}

        {state === 'Aqueous' && AQUEOUS_DOTS.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x} cy={d.y} r={4}
            fill={tint}
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ transformOrigin: `${d.x}px ${d.y}px` }}
          />
        ))}

        {state === 'Gas' && (
          <>
            <rect x="0" y="0" width={W} height={H} fill={tint} opacity={0.12} />
            {GAS_BUBBLES.map((b, i) => (
              <motion.circle
                key={i}
                cx={b.x} r={b.r}
                fill={tint} fillOpacity={0.5}
                initial={{ cy: H }}
                animate={{ cy: 0 }}
                transition={{ duration: b.period, delay: b.delay, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </>
        )}

        {/* Bubbles always simmer for the potion vibe. */}
        {POTION_BUBBLES.map((b, i) => (
          <motion.circle
            key={i}
            cx={b.x} r={b.r}
            fill={bubbleColor}
            initial={{ cy: H * 0.95, opacity: 0.45 }}
            animate={{ cy: H * 0.45, opacity: 0 }}
            transition={{ duration: b.period, delay: b.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </g>

      {/* Glass: faint inner sheen + rim/wall outline. */}
      <path d={FLASK_PATH} fill={tint} opacity={0.05} />
      <path
        d={FLASK_PATH}
        fill="none"
        stroke="white"
        strokeOpacity={highlighted ? 0.9 : 0.5}
        strokeWidth={highlighted ? 2.5 : 2}
      />

      {label && (
        <text x="50" y="96" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{label}</text>
      )}
    </svg>
  );
}
