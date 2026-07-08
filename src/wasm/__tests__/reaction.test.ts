import { describe, it, expect } from 'vitest';
import { solveCompoundReaction } from '../reaction';
import type { WasmTerm } from '@periodic-table';

describe('solveCompoundReaction', () => {
  it('solves NaOH + HCl as a feasible double displacement', () => {
    const r = solveCompoundReaction(
      [{ symbol: 'Na', is_polyatomic: false }, { symbol: 'OH', is_polyatomic: true }],
      [{ symbol: 'H', is_polyatomic: false }, { symbol: 'Cl', is_polyatomic: false }],
    );
    expect(r.feasible).toBe(true);
    expect(r.reaction_class).toBe('DoubleDisplacement');
    const formulas = r.products.map((p: WasmTerm) => p.formula).sort();
    expect(formulas).toEqual(['H₂O', 'NaCl']);
  });
});
