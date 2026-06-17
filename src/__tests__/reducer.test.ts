import { describe, it, expect } from 'vitest';
import { canvasReducer } from '../canvas/reducer';
import { INITIAL_STATE } from '../canvas/constants';
import type { CanvasState, ZoneState } from '../canvas/types';

const mgZone: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const clZone: ZoneState = {
  symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1, 1, 3, 5, 7],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const feZone: ZoneState = {
  symbol: 'Fe', elementClass: 'Metal', isPolyatomic: false, isTransition: true,
  valenceElectrons: 2, oxidationStates: [2, 3],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const oZone: ZoneState = {
  symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2, -1],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const caZone: ZoneState = {
  symbol: 'Ca', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const ohZone: ZoneState = {
  symbol: 'OH', elementClass: 'NonMetal', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const naZone: ZoneState = {
  symbol: 'Na', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 1, oxidationStates: [1],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const cuZone: ZoneState = {
  symbol: 'Cu', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 1, oxidationStates: [1, 2],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

describe('DROP_ELEMENT — first drop', () => {
  it('single drop → SLOT_A_FILLED, no bonding type yet', () => {
    const s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: mgZone });
    expect(s.canvasPhase).toBe('SLOT_A_FILLED');
    expect(s.bondingType).toBeNull();
    expect(s.slotA?.status).toBe('DEDUCING');
  });
});

describe('DROP_ELEMENT — second drop determines bonding', () => {
  const withMgInA: CanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'SLOT_A_FILLED',
    slotA: { ...mgZone, status: 'DEDUCING' },
  };

  it('Metal + NonMetal → Ionic, DEDUCING_CHARGE', () => {
    const s = canvasReducer(withMgInA, { type: 'DROP_ELEMENT', slot: 'B', zone: clZone });
    expect(s.bondingType).toBe('Ionic');
    expect(s.canvasPhase).toBe('DEDUCING_CHARGE');
    expect(s.activeDeductionSlot).toBe('B');
  });

  it('Metal + Metal → Metallic, SHOWING_METALLIC immediately', () => {
    const s = canvasReducer(withMgInA, { type: 'DROP_ELEMENT', slot: 'B', zone: naZone });
    expect(s.bondingType).toBe('Metallic');
    expect(s.canvasPhase).toBe('SHOWING_METALLIC');
  });
});

describe('DROP_ELEMENT — covalent', () => {
  const withClInA: CanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'SLOT_A_FILLED',
    slotA: { ...clZone, status: 'DEDUCING' },
  };

  it('NonMetal + NonMetal → Covalent, SHOWING_COVALENT immediately', () => {
    const s = canvasReducer(withClInA, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    expect(s.bondingType).toBe('Covalent');
    expect(s.canvasPhase).toBe('SHOWING_COVALENT');
  });
});

describe('SUBMIT_DEDUCTION — ionic', () => {
  const deducingBoth: CanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'DEDUCING_CHARGE',
    bondingType: 'Ionic',
    activeDeductionSlot: 'B',
    slotA: { ...mgZone, status: 'DEDUCING' },
    slotB: { ...clZone, status: 'DEDUCING' },
  };

  it('correct anion deduction → moves activeDeductionSlot to A', () => {
    const s = canvasReducer(deducingBoth, { type: 'SUBMIT_DEDUCTION', slot: 'B', loseOrGain: 'gain', count: 1 });
    expect(s.slotB?.status).toBe('IONIZED');
    expect(s.slotB?.derivedCharge).toBe(-1);
    expect(s.activeDeductionSlot).toBe('A');
    expect(s.canvasPhase).toBe('DEDUCING_CHARGE');
  });

  it('correct cation deduction after both ionized → READY_TO_CROSS', () => {
    const bothDeducing: CanvasState = {
      ...INITIAL_STATE,
      canvasPhase: 'DEDUCING_CHARGE',
      bondingType: 'Ionic',
      activeDeductionSlot: 'A',
      slotA: { ...mgZone, status: 'DEDUCING' },
      slotB: { ...clZone, status: 'IONIZED', derivedCharge: -1 },
    };
    const s = canvasReducer(bothDeducing, { type: 'SUBMIT_DEDUCTION', slot: 'A', loseOrGain: 'lose', count: 2 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.slotA?.derivedCharge).toBe(2);
  });

  it('wrong answer increments wrongCount', () => {
    const s = canvasReducer(deducingBoth, { type: 'SUBMIT_DEDUCTION', slot: 'A', loseOrGain: 'lose', count: 1 });
    expect(s.slotA?.wrongCount).toBe(1);
    expect(s.slotA?.status).toBe('DEDUCING');
  });

  it('wrong direction (metal tries to gain) increments wrongCount', () => {
    const s = canvasReducer(deducingBoth, { type: 'SUBMIT_DEDUCTION', slot: 'A', loseOrGain: 'gain', count: 2 });
    expect(s.slotA?.wrongCount).toBe(1);
  });
});

describe('PICK_TM_CHARGE', () => {
  const deducingFe: CanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'DEDUCING_CHARGE',
    bondingType: 'Ionic',
    activeDeductionSlot: 'A',
    slotA: { ...feZone, status: 'DEDUCING' },
    slotB: { ...oZone, status: 'DEDUCING' },
  };

  it('ionizes with chosen charge, moves to deduce other slot', () => {
    const s = canvasReducer(deducingFe, { type: 'PICK_TM_CHARGE', slot: 'A', charge: 3 });
    expect(s.slotA?.derivedCharge).toBe(3);
    expect(s.slotA?.status).toBe('IONIZED');
    expect(s.activeDeductionSlot).toBe('B');
  });
});

describe('CONFIRM_POLYATOMIC', () => {
  const deducingOH: CanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'DEDUCING_CHARGE',
    bondingType: 'Ionic',
    activeDeductionSlot: 'B',
    slotA: { ...caZone, status: 'DEDUCING' },
    slotB: { ...ohZone, status: 'DEDUCING', oxidationStates: [-1] },
  };

  it('ionizes with charge from oxidationStates[0]', () => {
    const s = canvasReducer(deducingOH, { type: 'CONFIRM_POLYATOMIC', slot: 'B' });
    expect(s.slotB?.derivedCharge).toBe(-1);
    expect(s.slotB?.status).toBe('IONIZED');
  });

  it('when other slot already IONIZED → READY_TO_CROSS', () => {
    const state: CanvasState = {
      ...INITIAL_STATE,
      canvasPhase: 'DEDUCING_CHARGE',
      bondingType: 'Ionic',
      activeDeductionSlot: 'B',
      slotA: { ...caZone, status: 'IONIZED', derivedCharge: 2 },
      slotB: { ...ohZone, status: 'DEDUCING', oxidationStates: [-1] },
    };
    const s = canvasReducer(state, { type: 'CONFIRM_POLYATOMIC', slot: 'B' });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.activeDeductionSlot).toBeNull();
  });
});

describe('default action', () => {
  it('unknown action type → returns state unchanged', () => {
    const s = canvasReducer(INITIAL_STATE, { type: 'UNKNOWN' } as any);
    expect(s).toBe(INITIAL_STATE);
  });
});

describe('QA cases — full ionic flow', () => {
  it('Mg + Cl → MgCl₂: A=Mg, B=Cl, deduce B then A', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: mgZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: clZone });
    expect(s.bondingType).toBe('Ionic');
    s = canvasReducer(s, { type: 'SUBMIT_DEDUCTION', slot: 'B', loseOrGain: 'gain', count: 1 });
    s = canvasReducer(s, { type: 'SUBMIT_DEDUCTION', slot: 'A', loseOrGain: 'lose', count: 2 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.slotA?.derivedCharge).toBe(2);
    expect(s.slotB?.derivedCharge).toBe(-1);
  });

  it('Ca + O → CaO: charges +2 and -2', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: caZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    s = canvasReducer(s, { type: 'SUBMIT_DEDUCTION', slot: 'B', loseOrGain: 'gain', count: 2 });
    s = canvasReducer(s, { type: 'SUBMIT_DEDUCTION', slot: 'A', loseOrGain: 'lose', count: 2 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.slotA?.derivedCharge).toBe(2);
    expect(s.slotB?.derivedCharge).toBe(-2);
  });

  it('Fe + O → Fe₂O₃: drop Fe in A, O in B, deduce O(B) first then Fe(A) TM pick', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: feZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    // activeDeductionSlot='B' (newly dropped O), deduce O first
    s = canvasReducer(s, { type: 'SUBMIT_DEDUCTION', slot: 'B', loseOrGain: 'gain', count: 2 });
    expect(s.activeDeductionSlot).toBe('A');
    s = canvasReducer(s, { type: 'PICK_TM_CHARGE', slot: 'A', charge: 3 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.slotA?.derivedCharge).toBe(3);
    expect(s.slotB?.derivedCharge).toBe(-2);
  });

  it('Mg + Na → Metallic bond, no charge deduction', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: mgZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: naZone });
    expect(s.bondingType).toBe('Metallic');
    expect(s.canvasPhase).toBe('SHOWING_METALLIC');
  });

  it('Cl + O → Covalent bond, no charge deduction', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: clZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    expect(s.bondingType).toBe('Covalent');
    expect(s.canvasPhase).toBe('SHOWING_COVALENT');
  });
});

describe('TRIGGER_CROSSOVER / CROSSOVER_COMPLETE / RESET', () => {
  const readyState: CanvasState = {
    canvasPhase: 'READY_TO_CROSS',
    bondingType: 'Ionic',
    activeDeductionSlot: null,
    slotA: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
    slotB: { ...clZone, status: 'IONIZED', derivedCharge: -1 },
  };

  it('TRIGGER_CROSSOVER → ANIMATING_CROSSOVER', () => {
    const s = canvasReducer(readyState, { type: 'TRIGGER_CROSSOVER' });
    expect(s.canvasPhase).toBe('ANIMATING_CROSSOVER');
  });

  it('CROSSOVER_COMPLETE → COMPLETE', () => {
    const s = canvasReducer({ ...readyState, canvasPhase: 'ANIMATING_CROSSOVER' }, { type: 'CROSSOVER_COMPLETE' });
    expect(s.canvasPhase).toBe('COMPLETE');
  });

  it('RESET → INITIAL_STATE', () => {
    const s = canvasReducer(readyState, { type: 'RESET' });
    expect(s).toEqual(INITIAL_STATE);
  });
});
