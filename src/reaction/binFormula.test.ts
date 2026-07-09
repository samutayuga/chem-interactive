import { describe, it, expect, vi } from 'vitest';
import type { ZoneState } from '../canvas/types';

vi.mock('../wasm/chem', () => ({
  classifyReaction: () => ({ bonding: 'Ionic' }),
}));

import { binCompound } from './binFormula';

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

const pt = {} as never; // classifyReaction is mocked, pt is unused

describe('binCompound', () => {
  it('returns null for a single species', () => {
    expect(binCompound(pt, [z('Na', { derivedCharge: 1 })])).toBeNull();
  });

  it('returns null for an empty bin', () => {
    expect(binCompound(pt, [])).toBeNull();
  });

  it('returns a charge-balanced formula for two resolved species', () => {
    expect(binCompound(pt, [z('Mg', { derivedCharge: 2 }), z('Cl', { derivedCharge: -1 })]))
      .toBe('MgCl₂');
  });

  it('returns null while a transition-metal charge is unresolved', () => {
    expect(binCompound(pt, [z('Cu', { isTransition: true, oxidationStates: [1, 2] }), z('Cl', { derivedCharge: -1 })]))
      .toBeNull();
  });
});
