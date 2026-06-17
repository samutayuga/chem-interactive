import { describe, it, expect } from 'vitest';
import { canvasReducer } from '../canvas/reducer';
import { INITIAL_STATE } from '../canvas/constants';
import type { CanvasState, ZoneState } from '../canvas/types';

const mgZone: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const clZone: ZoneState = {
  symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1, 1, 3, 5, 7], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const feZone: ZoneState = {
  symbol: 'Fe', elementClass: 'Metal', isPolyatomic: false, isTransition: true,
  valenceElectrons: 2, oxidationStates: [2, 3], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const oZone: ZoneState = {
  symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2, -1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const caZone: ZoneState = {
  symbol: 'Ca', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const ohZone: ZoneState = {
  symbol: 'OH', elementClass: 'NonMetal', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const naZone: ZoneState = {
  symbol: 'Na', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 1, oxidationStates: [1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

describe('DROP_ELEMENT — first drop', () => {
  it('single drop → SLOT_A_FILLED, status NEUTRAL, no bondingType', () => {
    const s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: mgZone });
    expect(s.canvasPhase).toBe('SLOT_A_FILLED');
    expect(s.bondingType).toBeNull();
    expect(s.slotA?.status).toBe('NEUTRAL');
  });
});

describe('DROP_ELEMENT — second drop, ionic auto-resolve', () => {
  const withMgInA: CanvasState = {
    ...INITIAL_STATE, canvasPhase: 'SLOT_A_FILLED', slotA: { ...mgZone, status: 'NEUTRAL' },
  };

  it('Metal + NonMetal → Ionic, both auto-ionised, EXPLAINING', () => {
    const s = canvasReducer(withMgInA, { type: 'DROP_ELEMENT', slot: 'B', zone: clZone });
    expect(s.bondingType).toBe('Ionic');
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotA?.status).toBe('IONIZED');
    expect(s.slotA?.derivedCharge).toBe(2);
    expect(s.slotB?.status).toBe('IONIZED');
    expect(s.slotB?.derivedCharge).toBe(-1);
  });

  it('polyatomic anion auto-ionised with oxidationStates[0]', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'SLOT_A_FILLED', slotA: { ...caZone, status: 'NEUTRAL' } },
      { type: 'DROP_ELEMENT', slot: 'B', zone: ohZone },
    );
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotB?.status).toBe('IONIZED');
    expect(s.slotB?.derivedCharge).toBe(-1);
  });

  it('transition metal stays DEDUCING, non-TM partner auto-ionised', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'SLOT_A_FILLED', slotA: { ...feZone, status: 'NEUTRAL' } },
      { type: 'DROP_ELEMENT', slot: 'B', zone: oZone },
    );
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotA?.status).toBe('DEDUCING');
    expect(s.slotA?.derivedCharge).toBeNull();
    expect(s.slotB?.status).toBe('IONIZED');
    expect(s.slotB?.derivedCharge).toBe(-2);
  });
});

describe('DROP_ELEMENT — second drop, non-ionic', () => {
  it('NonMetal + NonMetal → Covalent, EXPLAINING, slots stay NEUTRAL', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: clZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    expect(s.bondingType).toBe('Covalent');
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotA?.status).toBe('NEUTRAL');
    expect(s.slotB?.status).toBe('NEUTRAL');
  });

  it('Metal + Metal → Metallic, EXPLAINING', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: mgZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: naZone });
    expect(s.bondingType).toBe('Metallic');
    expect(s.canvasPhase).toBe('EXPLAINING');
  });
});

describe('PICK_TM_CHARGE', () => {
  const explaining: CanvasState = {
    ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
    slotA: { ...feZone, status: 'DEDUCING' },
    slotB: { ...oZone, status: 'IONIZED', derivedCharge: -2 },
  };

  it('ionises TM slot, phase stays EXPLAINING', () => {
    const s = canvasReducer(explaining, { type: 'PICK_TM_CHARGE', slot: 'A', charge: 3 });
    expect(s.slotA?.derivedCharge).toBe(3);
    expect(s.slotA?.status).toBe('IONIZED');
    expect(s.canvasPhase).toBe('EXPLAINING');
  });
});

describe('DISMISS_EXPLANATION', () => {
  it('Ionic → ANIMATING_CROSSOVER', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
        slotA: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
        slotB: { ...clZone, status: 'IONIZED', derivedCharge: -1 } },
      { type: 'DISMISS_EXPLANATION' },
    );
    expect(s.canvasPhase).toBe('ANIMATING_CROSSOVER');
  });

  it('Covalent → SHOWING_COVALENT', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Covalent',
        slotA: { ...clZone, status: 'NEUTRAL' }, slotB: { ...oZone, status: 'NEUTRAL' } },
      { type: 'DISMISS_EXPLANATION' },
    );
    expect(s.canvasPhase).toBe('SHOWING_COVALENT');
  });

  it('Metallic → SHOWING_METALLIC', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Metallic',
        slotA: { ...mgZone, status: 'NEUTRAL' }, slotB: { ...naZone, status: 'NEUTRAL' } },
      { type: 'DISMISS_EXPLANATION' },
    );
    expect(s.canvasPhase).toBe('SHOWING_METALLIC');
  });

  it('Ionic + TM still DEDUCING → no-op (state unchanged)', () => {
    const state: CanvasState = {
      ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: { ...feZone, status: 'DEDUCING' },
      slotB: { ...oZone, status: 'IONIZED', derivedCharge: -2 },
    };
    const s = canvasReducer(state, { type: 'DISMISS_EXPLANATION' });
    expect(s).toBe(state);
    expect(s.canvasPhase).toBe('EXPLAINING');
  });
});

describe('REPLACE_ELEMENT', () => {
  const explaining: CanvasState = {
    ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
    slotA: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
    slotB: { ...clZone, status: 'IONIZED', derivedCharge: -1 },
  };

  it('replace slotB → null, slotA reset to NEUTRAL, SLOT_A_FILLED, bondingType null', () => {
    const s = canvasReducer(explaining, { type: 'REPLACE_ELEMENT', slot: 'B' });
    expect(s.slotB).toBeNull();
    expect(s.slotA?.status).toBe('NEUTRAL');
    expect(s.slotA?.derivedCharge).toBeNull();
    expect(s.canvasPhase).toBe('SLOT_A_FILLED');
    expect(s.bondingType).toBeNull();
  });

  it('replace slotA → null, slotB reset to NEUTRAL, SLOT_A_FILLED', () => {
    const s = canvasReducer(explaining, { type: 'REPLACE_ELEMENT', slot: 'A' });
    expect(s.slotA).toBeNull();
    expect(s.slotB?.status).toBe('NEUTRAL');
    expect(s.slotB?.derivedCharge).toBeNull();
    expect(s.canvasPhase).toBe('SLOT_A_FILLED');
  });

  it('replace only slot → SELECTING', () => {
    const oneSlot: CanvasState = {
      ...INITIAL_STATE, canvasPhase: 'SLOT_A_FILLED', slotA: { ...mgZone, status: 'NEUTRAL' },
    };
    const s = canvasReducer(oneSlot, { type: 'REPLACE_ELEMENT', slot: 'A' });
    expect(s.slotA).toBeNull();
    expect(s.canvasPhase).toBe('SELECTING');
  });
});

describe('CROSSOVER_COMPLETE / RESET', () => {
  const animating: CanvasState = {
    ...INITIAL_STATE, canvasPhase: 'ANIMATING_CROSSOVER', bondingType: 'Ionic',
    slotA: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
    slotB: { ...clZone, status: 'IONIZED', derivedCharge: -1 },
  };
  it('CROSSOVER_COMPLETE → COMPLETE', () => {
    expect(canvasReducer(animating, { type: 'CROSSOVER_COMPLETE' }).canvasPhase).toBe('COMPLETE');
  });
  it('RESET → INITIAL_STATE', () => {
    expect(canvasReducer(animating, { type: 'RESET' })).toEqual(INITIAL_STATE);
  });
});

describe('default', () => {
  it('unknown action → state unchanged', () => {
    expect(canvasReducer(INITIAL_STATE, { type: 'UNKNOWN' } as any)).toBe(INITIAL_STATE);
  });
});

describe('QA — full auto-resolve flow', () => {
  it('Mg + Cl: charges +2, -1 auto-resolved in one drop', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: mgZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: clZone });
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotA?.derivedCharge).toBe(2);
    expect(s.slotB?.derivedCharge).toBe(-1);
  });

  it('Ca + O: charges +2, -2 auto-resolved', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: caZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    expect(s.slotA?.derivedCharge).toBe(2);
    expect(s.slotB?.derivedCharge).toBe(-2);
  });

  it('Fe + O: O auto-ionised, Fe needs TM pick before dismiss', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: feZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    expect(s.slotA?.status).toBe('DEDUCING');
    s = canvasReducer(s, { type: 'PICK_TM_CHARGE', slot: 'A', charge: 3 });
    expect(s.slotA?.derivedCharge).toBe(3);
    expect(s.canvasPhase).toBe('EXPLAINING');
  });
});
