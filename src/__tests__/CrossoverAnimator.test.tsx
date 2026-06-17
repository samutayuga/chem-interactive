import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { CrossoverAnimator } from '../bridge/CrossoverAnimator';
import type { ZoneState } from '../canvas/types';

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, onAnimationComplete, ...rest }: any) => {
      if (onAnimationComplete) setTimeout(onAnimationComplete, 0);
      return <span {...rest}>{children}</span>;
    },
    div: ({ children, onAnimationComplete, ...rest }: any) => {
      if (onAnimationComplete) setTimeout(onAnimationComplete, 0);
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mg: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: 2, wrongCount: 0, status: 'IONIZED',
};
const cl: ZoneState = {
  symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1],
  derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
};
const ca: ZoneState = {
  symbol: 'Ca', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: 2, wrongCount: 0, status: 'IONIZED',
};
const o: ZoneState = {
  symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2],
  derivedCharge: -2, wrongCount: 0, status: 'IONIZED',
};
const oh: ZoneState = {
  symbol: 'OH', elementClass: 'NonMetal', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1],
  derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
};

describe('CrossoverAnimator animation flow', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  // Each React setState from a timer needs its own act() flush before the next
  // useEffect fires and schedules the following timer.
  const runSteps = async (n = 5) => {
    for (let i = 0; i < n; i++) {
      await act(async () => { vi.runAllTimers(); });
    }
  };

  it('calls onComplete after full animation — no brackets, no gcd (Mg+Cl)', async () => {
    const onComplete = vi.fn();
    render(<CrossoverAnimator cation={mg} anion={cl} onComplete={onComplete} />);
    await runSteps();
    expect(onComplete).toHaveBeenCalled();
  });

  it('calls onComplete after full animation — brackets, no gcd (Ca+OH)', async () => {
    const onComplete = vi.fn();
    render(<CrossoverAnimator cation={ca} anion={oh} onComplete={onComplete} />);
    await runSteps();
    expect(onComplete).toHaveBeenCalled();
  });

  it('calls onComplete after full animation — no brackets, with gcd (Ca+O)', async () => {
    const onComplete = vi.fn();
    render(<CrossoverAnimator cation={ca} anion={o} onComplete={onComplete} />);
    await runSteps();
    expect(onComplete).toHaveBeenCalled();
  });
});

describe('CrossoverAnimator — cation subscript > 1 (Fe3+ + O2-)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const runSteps = async (n = 5) => {
    for (let i = 0; i < n; i++) {
      await act(async () => { vi.runAllTimers(); });
    }
  };

  it('calls onComplete after full animation — both subscripts > 1', async () => {
    const fe3: ZoneState = {
      symbol: 'Fe', elementClass: 'Metal', isPolyatomic: false, isTransition: true,
      valenceElectrons: 2, oxidationStates: [3],
      derivedCharge: 3, wrongCount: 0, status: 'IONIZED',
    };
    const o2: ZoneState = {
      symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
      valenceElectrons: 6, oxidationStates: [-2],
      derivedCharge: -2, wrongCount: 0, status: 'IONIZED',
    };
    const onComplete = vi.fn();
    const { getByTestId } = render(
      <CrossoverAnimator cation={fe3} anion={o2} onComplete={onComplete} />
    );
    // finalCationSub = |anion charge| / gcd = 2/1 = 2, finalAnionSub = |cation charge| / gcd = 3/1 = 3
    expect(getByTestId('cation-sub').textContent).toBe('2');
    expect(getByTestId('anion-sub').textContent).toBe('3');
    await runSteps();
    expect(onComplete).toHaveBeenCalled();
  });
});

describe('CrossoverAnimator subscript computation', () => {
  it('Mg²⁺ + Cl⁻ → cationSub=1, anionSub=2', () => {
    const onComplete = vi.fn();
    const { getByTestId } = render(
      <CrossoverAnimator cation={mg} anion={cl} onComplete={onComplete} />
    );
    expect(getByTestId('cation-sub').textContent).toBe('1');
    expect(getByTestId('anion-sub').textContent).toBe('2');
  });

  it('Ca²⁺ + O²⁻ → cationSub=1, anionSub=1 after GCD=2', () => {
    const { getByTestId } = render(
      <CrossoverAnimator cation={ca} anion={o} onComplete={vi.fn()} />
    );
    expect(getByTestId('final-cation-sub').textContent).toBe('1');
    expect(getByTestId('final-anion-sub').textContent).toBe('1');
  });

  it('shows brackets when anion is polyatomic and anion sub > 1', () => {
    const { queryByTestId } = render(
      <CrossoverAnimator cation={ca} anion={oh} onComplete={vi.fn()} />
    );
    // Ca²⁺ + OH⁻ → Ca(OH)₂ — anion sub = 2 > 1 and polyatomic
    expect(queryByTestId('brackets')).toBeInTheDocument();
  });

  it('no brackets when anion sub === 1', () => {
    const na: ZoneState = {
      symbol: 'Na', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
      valenceElectrons: 1, oxidationStates: [1],
      derivedCharge: 1, wrongCount: 0, status: 'IONIZED',
    };
    const { queryByTestId } = render(
      <CrossoverAnimator cation={na} anion={oh} onComplete={vi.fn()} />
    );
    // Na⁺ + OH⁻ → NaOH — anion sub = 1 → no brackets
    expect(queryByTestId('brackets')).not.toBeInTheDocument();
  });
});
