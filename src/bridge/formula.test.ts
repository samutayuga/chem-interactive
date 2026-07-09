import { describe, it, expect } from 'vitest';
import { productInfo, fmt, toSub } from './formula';
import type { ZoneState } from '../canvas/types';
import type { WasmReaction } from '@periodic-table';

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

describe('formula helpers', () => {
  it('toSub / fmt render unicode subscripts', () => {
    expect(toSub(2)).toBe('₂');
    expect(fmt('Cl', 1)).toBe('Cl');
    expect(fmt('Cl', 2)).toBe('Cl₂');
  });

  it('ionic 1:1 → NaCl', () => {
    const r = { bonding: 'Ionic' } as WasmReaction;
    expect(productInfo(r, z('Na', { derivedCharge: 1 }), z('Cl', { derivedCharge: -1 })).formula)
      .toBe('NaCl');
  });

  it('ionic charge crossover → MgCl₂', () => {
    const r = { bonding: 'Ionic' } as WasmReaction;
    expect(productInfo(r, z('Mg', { derivedCharge: 2 }), z('Cl', { derivedCharge: -1 })).formula)
      .toBe('MgCl₂');
  });

  it('covalent uses reaction stoich → CO₂', () => {
    const r = { bonding: 'Covalent', covalent: { n_a: 1, n_b: 2 } } as unknown as WasmReaction;
    expect(productInfo(r, z('C'), z('O')).formula).toBe('CO₂');
  });

  it('ionic parenthesises a polyatomic cation with subscript > 1 → (NH₄)₂SO₄', () => {
    const r = { bonding: 'Ionic' } as WasmReaction;
    expect(productInfo(
      r,
      z('NH₄', { isPolyatomic: true, derivedCharge: 1 }),
      z('SO₄', { isPolyatomic: true, derivedCharge: -2 }),
    ).formula).toBe('(NH₄)₂SO₄');
  });
});
