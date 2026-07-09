import { describe, it, expect } from 'vitest';
import { reactionReducer, INITIAL_REACTION_STATE } from './reactionReducer';
import type { ZoneState } from '../canvas/types';

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

describe('reactionReducer', () => {
  it('adds a species to the active bin', () => {
    const s = reactionReducer(INITIAL_REACTION_STATE, { type: 'PICK_SPECIES', zone: z('Na') });
    expect(s.reactantA.map(x => x.symbol)).toEqual(['Na']);
  });
  it('caps a bin at 2 species', () => {
    let s = INITIAL_REACTION_STATE;
    for (const sym of ['Na', 'O', 'H']) s = reactionReducer(s, { type: 'PICK_SPECIES', zone: z(sym) });
    expect(s.reactantA).toHaveLength(2);
  });
  it('routes picks to the active bin', () => {
    let s = reactionReducer(INITIAL_REACTION_STATE, { type: 'SET_ACTIVE_BIN', bin: 'B' });
    s = reactionReducer(s, { type: 'PICK_SPECIES', zone: z('Cl') });
    expect(s.reactantB.map(x => x.symbol)).toEqual(['Cl']);
    expect(s.reactantA).toHaveLength(0);
  });
  it('removes a species by index', () => {
    let s = reactionReducer(INITIAL_REACTION_STATE, { type: 'PICK_SPECIES', zone: z('Na') });
    s = reactionReducer(s, { type: 'PICK_SPECIES', zone: z('O') });
    s = reactionReducer(s, { type: 'REMOVE_SPECIES', bin: 'A', index: 0 });
    expect(s.reactantA.map(x => x.symbol)).toEqual(['O']);
  });
  it('sets a transition-metal charge on the indexed species', () => {
    let s = reactionReducer(INITIAL_REACTION_STATE, { type: 'PICK_SPECIES', zone: z('Cu', { isTransition: true, oxidationStates: [1, 2] }) });
    s = reactionReducer(s, { type: 'SET_TM_CHARGE', bin: 'A', index: 0, charge: 2 });
    expect(s.reactantA[0].derivedCharge).toBe(2);
  });
  it('clears the result whenever the inputs change', () => {
    const withResult = { ...INITIAL_REACTION_STATE, result: { feasible: true } as never };
    expect(reactionReducer(withResult, { type: 'PICK_SPECIES', zone: z('Na') }).result).toBeNull();
  });
  it('clears the result when a quantity changes', () => {
    const withResult = { ...INITIAL_REACTION_STATE, result: { feasible: true } as never };
    const s = reactionReducer(withResult, { type: 'SET_QTY', bin: 'A', entry: { value: 2, unit: 'mole' } });
    expect(s.qtyA).toEqual({ value: 2, unit: 'mole' });
    expect(s.result).toBeNull();
  });
  it('resets to the initial state', () => {
    let s = reactionReducer(INITIAL_REACTION_STATE, { type: 'PICK_SPECIES', zone: z('Na') });
    expect(reactionReducer(s, { type: 'RESET' })).toEqual(INITIAL_REACTION_STATE);
  });
});
