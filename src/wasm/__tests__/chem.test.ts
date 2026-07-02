import { describe, it, expect, beforeAll } from 'vitest';
import { PeriodicTable } from '@periodic-table';
import { classifyReaction, solveStoich, listPolyatomicIons, valenceOf } from '../chem';

let pt: PeriodicTable;
beforeAll(() => { pt = PeriodicTable.load(); });

describe('chem wrappers', () => {
  it('classifies Na + Cl as Ionic solid', () => {
    const r = classifyReaction(pt, 'Na', 'Cl')!;
    expect(r.bonding).toBe('Ionic');
    expect(r.product_state).toBe('Solid');
  });
  it('classifies S + O as Covalent (SO2)', () => {
    const r = classifyReaction(pt, 'S', 'O')!;
    expect(r.bonding).toBe('Covalent');
    expect(r.covalent).toMatchObject({ n_a: 1, n_b: 2, bond_order: 2 });
  });
  it('solves 2H + O water stoichiometry (monoatomic, no diatomic assumption)', () => {
    const r = solveStoich(pt,
      { symbol: 'H', subscript: 2, amount: 2, unit: 'mole' },
      { symbol: 'O', subscript: 1, amount: 1, unit: 'mole' })!;
    expect([r.coeff_a, r.coeff_b, r.coeff_product]).toEqual([2, 1, 1]);
    expect(r.limiting).toBe('Both');
    expect(r.diatomic_messages).toEqual([]);
  });
  it('lists 6 polyatomic ions incl sulfate -2', () => {
    const ions = listPolyatomicIons(pt);
    expect(ions).toHaveLength(6);
    expect(ions.find(i => i.symbol === 'SO₄')!.charge).toBe(-2);
  });
  it('valence of Cl is 7', () => {
    expect(valenceOf(pt, 'Cl')).toBe(7);
  });
});
