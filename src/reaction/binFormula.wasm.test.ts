import { describe, it, expect, beforeAll } from 'vitest';
import { PeriodicTable } from '@periodic-table';
import type { ZoneState } from '../canvas/types';
import { binCompound } from './binFormula';

// Uses the real wasm classifier (no mock) so covalent classification and
// electronegativity-based ordering are exercised end-to-end.
let pt: PeriodicTable;
beforeAll(() => { pt = PeriodicTable.load(); });

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

describe('binCompound (real wasm)', () => {
  it('writes covalent CO₂ with carbon first regardless of click order', () => {
    expect(binCompound(pt, [z('C', { oxidationStates: [-4, 4] }), z('O', { oxidationStates: [-2] })]))
      .toBe('CO₂');
    // reversed click order must still canonicalise to CO₂, not O₂C
    expect(binCompound(pt, [z('O', { oxidationStates: [-2] }), z('C', { oxidationStates: [-4, 4] })]))
      .toBe('CO₂');
  });

  it('writes covalent SO₂ with sulfur first', () => {
    expect(binCompound(pt, [z('O', { oxidationStates: [-2] }), z('S', { oxidationStates: [-2, 6] })]))
      .toBe('SO₂');
  });

  it('still writes ionic NaCl with the metal first', () => {
    expect(binCompound(pt, [
      z('Cl', { elementClass: 'NonMetal', derivedCharge: -1, oxidationStates: [-1] }),
      z('Na', { elementClass: 'Metal', derivedCharge: 1, oxidationStates: [1] }),
    ])).toBe('NaCl');
  });
});
