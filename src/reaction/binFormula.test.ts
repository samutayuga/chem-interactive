import { describe, it, expect, vi } from 'vitest';
import type { ZoneState } from '../canvas/types';

vi.mock('../wasm/chem', () => ({
  classifyReaction: vi.fn(() => ({ bonding: 'Ionic' })),
}));

import { binCompound } from './binFormula';
import { classifyReaction } from '../wasm/chem';

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

  it('treats a polyatomic ion pair as ionic without calling the wasm classifier', () => {
    // pt.react only resolves bare elemental symbols and returns undefined for
    // ion symbols like "OH", so binCompound must short-circuit to Ionic and
    // never reach classifyReaction (avoiding the "Na·OH" dot-formula fallback).
    vi.mocked(classifyReaction).mockClear();
    expect(binCompound(pt, [
      z('Na', { derivedCharge: 1 }),
      z('OH', { isPolyatomic: true, derivedCharge: -1 }),
    ])).toBe('NaOH');
    expect(classifyReaction).not.toHaveBeenCalled();
  });

  it('canonicalises cation→anion regardless of click order (Ca(OH)₂)', () => {
    // productInfo trusts slotA=cation/slotB=anion; species arrive in raw click
    // order. Clicking the polyatomic ion first must still yield "Ca(OH)₂",
    // not the malformed "OH₂Ca".
    const expected = 'Ca(OH)₂';
    // reversed order: OH clicked first, then Ca
    expect(binCompound(pt, [
      z('OH', { derivedCharge: -1, isPolyatomic: true }),
      z('Ca', { derivedCharge: 2 }),
    ])).toBe(expected);
    // forward order: same result (order-independent)
    expect(binCompound(pt, [
      z('Ca', { derivedCharge: 2 }),
      z('OH', { derivedCharge: -1, isPolyatomic: true }),
    ])).toBe(expected);
  });

  it('parenthesises a polyatomic cation regardless of click order ((NH₄)₂SO₄)', () => {
    // NH₄⁺ is a polyatomic CATION; paired with SO₄²⁻ its subscript is 2, so
    // both canonicalisation (cation→slotA) and symmetric parenthesisation in
    // productInfo must fire to yield "(NH₄)₂SO₄", not "NH₄₂SO₄".
    const expected = '(NH₄)₂SO₄';
    // reversed order: anion clicked first
    expect(binCompound(pt, [
      z('SO₄', { derivedCharge: -2, isPolyatomic: true }),
      z('NH₄', { derivedCharge: 1, isPolyatomic: true }),
    ])).toBe(expected);
    // forward order: same result
    expect(binCompound(pt, [
      z('NH₄', { derivedCharge: 1, isPolyatomic: true }),
      z('SO₄', { derivedCharge: -2, isPolyatomic: true }),
    ])).toBe(expected);
  });
});
