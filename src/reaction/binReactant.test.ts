import { describe, it, expect, beforeAll } from 'vitest';
import { PeriodicTable } from '@periodic-table';
import type { ZoneState } from '../canvas/types';
import { binReactant, parseFormula } from './binReactant';

let pt: PeriodicTable;
beforeAll(() => { pt = PeriodicTable.load(); });

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

describe('parseFormula', () => {
  it('parses a bare element as a single atom', () => {
    expect(parseFormula('Na')).toEqual({ Na: 1 });
  });
  it('parses a polyatomic ion with a subscript', () => {
    expect(parseFormula('SO₄')).toEqual({ S: 1, O: 4 });
    expect(parseFormula('NH₄')).toEqual({ N: 1, H: 4 });
    expect(parseFormula('OH')).toEqual({ O: 1, H: 1 });
  });
});

describe('binReactant', () => {
  it('returns null for an empty bin', () => {
    expect(binReactant(pt, [])).toBeNull();
  });

  it('reports Ar (relative atomic mass) for a lone atom', () => {
    const r = binReactant(pt, [z('O')])!;
    expect(r.massKind).toBe('Ar');
    expect(r.formula).toBe('O');
    expect(r.molarMass).toBeCloseTo(15.999, 2);
  });

  it('reports Mr for a covalent compound (CO₂), summing every atom', () => {
    const r = binReactant(pt, [z('C', { oxidationStates: [-4, 4] }), z('O', { oxidationStates: [-2] })])!;
    expect(r.formula).toBe('CO₂');
    expect(r.massKind).toBe('Mr');
    expect(r.molarMass).toBeCloseTo(44.009, 2); // 12.011 + 2 × 15.999
  });

  it('reports Mr for an ionic compound (MgCl₂)', () => {
    const r = binReactant(pt, [
      z('Mg', { elementClass: 'Metal', derivedCharge: 2, oxidationStates: [2] }),
      z('Cl', { derivedCharge: -1, oxidationStates: [-1] }),
    ])!;
    expect(r.formula).toBe('MgCl₂');
    expect(r.massKind).toBe('Mr');
    expect(r.molarMass).toBeCloseTo(24.305 + 2 * 35.453, 1);
  });

  it('expands a polyatomic ion when summing mass — Ca(OH)₂', () => {
    const r = binReactant(pt, [
      z('Ca', { elementClass: 'Metal', derivedCharge: 2, oxidationStates: [2] }),
      z('OH', { isPolyatomic: true, derivedCharge: -1 }),
    ])!;
    expect(r.formula).toBe('Ca(OH)₂');
    expect(r.massKind).toBe('Mr');
    // 40.078 + 2 × (15.999 + 1.008)
    expect(r.molarMass).toBeCloseTo(40.078 + 2 * (15.999 + 1.008), 1);
  });

  it('reports Mr for a lone polyatomic ion, expanding its atoms (SO₄)', () => {
    const r = binReactant(pt, [z('SO₄', { isPolyatomic: true })])!;
    expect(r.formula).toBe('SO₄');
    expect(r.massKind).toBe('Mr');
    expect(r.molarMass).toBeCloseTo(32.06 + 4 * 15.999, 1);
  });

  it('returns null when an element is unknown to the table', () => {
    expect(binReactant(pt, [z('Xx')])).toBeNull();
  });

  it('returns null for an over-full bin (3 species)', () => {
    expect(binReactant(pt, [z('Na'), z('Cl'), z('O')])).toBeNull();
  });

  it('returns null while a transition-metal charge is unresolved (2 species)', () => {
    expect(binReactant(pt, [
      z('Cu', { isTransition: true, oxidationStates: [1, 2] }),
      z('Cl', { derivedCharge: -1 }),
    ])).toBeNull();
  });
});
