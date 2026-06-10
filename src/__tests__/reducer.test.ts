// src/__tests__/reducer.test.ts
import { describe, it, expect } from 'vitest';
import { ionicReducer } from '../canvas/reducer';
import { INITIAL_STATE } from '../canvas/constants';
import type { IonicCanvasState, ZoneState } from '../canvas/types';

const mgZone: ZoneState = {
  symbol: 'Mg', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const clZone: ZoneState = {
  symbol: 'Cl', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1, 1, 3, 5, 7],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const feZone: ZoneState = {
  symbol: 'Fe', isPolyatomic: false, isTransition: true,
  valenceElectrons: 2, oxidationStates: [2, 3],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const oZone: ZoneState = {
  symbol: 'O', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2, -1],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const caZone: ZoneState = {
  symbol: 'Ca', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const ohZone: ZoneState = {
  symbol: 'OH', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

describe('DROP_ELEMENT', () => {
  it('moves to DEDUCING_CHARGE when cation dropped', () => {
    const s = ionicReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', side: 'cation', zone: mgZone });
    expect(s.canvasPhase).toBe('DEDUCING_CHARGE');
    expect(s.activeDeductionSide).toBe('cation');
    expect(s.cation?.status).toBe('DEDUCING');
  });

  it('moves to DEDUCING_CHARGE when anion dropped after cation ionized', () => {
    const withCation: IonicCanvasState = {
      ...INITIAL_STATE,
      canvasPhase: 'SELECTING',
      cation: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
    };
    const s = ionicReducer(withCation, { type: 'DROP_ELEMENT', side: 'anion', zone: clZone });
    expect(s.canvasPhase).toBe('DEDUCING_CHARGE');
    expect(s.activeDeductionSide).toBe('anion');
  });
});

describe('SUBMIT_DEDUCTION', () => {
  const deducingMg: IonicCanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'DEDUCING_CHARGE',
    activeDeductionSide: 'cation',
    cation: { ...mgZone, status: 'DEDUCING' },
  };

  it('correct answer ionizes cation, returns to SELECTING if anion empty', () => {
    const s = ionicReducer(deducingMg, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 2 });
    expect(s.cation?.status).toBe('IONIZED');
    expect(s.cation?.derivedCharge).toBe(2);
    expect(s.canvasPhase).toBe('SELECTING');
    expect(s.activeDeductionSide).toBeNull();
  });

  it('correct answer → READY_TO_CROSS when other zone already IONIZED', () => {
    const withBoth: IonicCanvasState = {
      ...deducingMg,
      anion: { ...clZone, status: 'IONIZED', derivedCharge: -1 },
    };
    const s = ionicReducer(withBoth, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 2 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
  });

  it('wrong answer increments wrongCount', () => {
    const s = ionicReducer(deducingMg, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 1 });
    expect(s.cation?.wrongCount).toBe(1);
    expect(s.cation?.status).toBe('DEDUCING');
    expect(s.canvasPhase).toBe('DEDUCING_CHARGE');
  });

  it('wrong loseOrGain direction increments wrongCount', () => {
    const s = ionicReducer(deducingMg, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'gain', count: 2 });
    expect(s.cation?.wrongCount).toBe(1);
  });
});

describe('PICK_TM_CHARGE', () => {
  const deducingFe: IonicCanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'DEDUCING_CHARGE',
    activeDeductionSide: 'cation',
    cation: { ...feZone, status: 'DEDUCING' },
  };

  it('ionizes with chosen charge', () => {
    const s = ionicReducer(deducingFe, { type: 'PICK_TM_CHARGE', side: 'cation', charge: 3 });
    expect(s.cation?.derivedCharge).toBe(3);
    expect(s.cation?.status).toBe('IONIZED');
  });
});

describe('CONFIRM_POLYATOMIC', () => {
  const deducingOH: IonicCanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'DEDUCING_CHARGE',
    activeDeductionSide: 'anion',
    anion: { ...ohZone, status: 'DEDUCING', oxidationStates: [-1] },
  };

  it('ionizes with charge from oxidationStates[0]', () => {
    const s = ionicReducer(deducingOH, { type: 'CONFIRM_POLYATOMIC', side: 'anion' });
    expect(s.anion?.derivedCharge).toBe(-1);
    expect(s.anion?.status).toBe('IONIZED');
  });
});

describe('QA cases', () => {
  it('Mg + Cl → MgCl₂: both ionize to charges +2 and -1', () => {
    let s = ionicReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', side: 'cation', zone: mgZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 2 });
    s = ionicReducer(s, { type: 'DROP_ELEMENT', side: 'anion', zone: clZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'anion', loseOrGain: 'gain', count: 1 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.cation?.derivedCharge).toBe(2);
    expect(s.anion?.derivedCharge).toBe(-1);
  });

  it('Ca + O → CaO: charges +2 and -2 (GCD=2 handled by animator)', () => {
    let s = ionicReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', side: 'cation', zone: caZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 2 });
    s = ionicReducer(s, { type: 'DROP_ELEMENT', side: 'anion', zone: oZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'anion', loseOrGain: 'gain', count: 2 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.cation?.derivedCharge).toBe(2);
    expect(s.anion?.derivedCharge).toBe(-2);
  });

  it('Fe + O → Fe₂O₃: TM pick Fe³⁺ then O gains 2', () => {
    let s = ionicReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', side: 'cation', zone: feZone });
    s = ionicReducer(s, { type: 'PICK_TM_CHARGE', side: 'cation', charge: 3 });
    s = ionicReducer(s, { type: 'DROP_ELEMENT', side: 'anion', zone: oZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'anion', loseOrGain: 'gain', count: 2 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.cation?.derivedCharge).toBe(3);
    expect(s.anion?.derivedCharge).toBe(-2);
  });
});

describe('TRIGGER_CROSSOVER / CROSSOVER_COMPLETE / RESET', () => {
  const readyState: IonicCanvasState = {
    canvasPhase: 'READY_TO_CROSS',
    activeDeductionSide: null,
    cation: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
    anion:  { ...clZone, status: 'IONIZED', derivedCharge: -1 },
  };

  it('TRIGGER_CROSSOVER → ANIMATING_CROSSOVER', () => {
    const s = ionicReducer(readyState, { type: 'TRIGGER_CROSSOVER' });
    expect(s.canvasPhase).toBe('ANIMATING_CROSSOVER');
  });

  it('CROSSOVER_COMPLETE → COMPLETE', () => {
    const s = ionicReducer({ ...readyState, canvasPhase: 'ANIMATING_CROSSOVER' }, { type: 'CROSSOVER_COMPLETE' });
    expect(s.canvasPhase).toBe('COMPLETE');
  });

  it('RESET → INITIAL_STATE', () => {
    const s = ionicReducer(readyState, { type: 'RESET' });
    expect(s).toEqual(INITIAL_STATE);
  });
});
