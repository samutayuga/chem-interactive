import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoichResultPanel } from '../StoichResultPanel';
import type { WasmStoichResult } from '@periodic-table';

const base: WasmStoichResult = {
  coeff_a: 2, coeff_b: 1, coeff_product: 2, product_molar_mass: 18.015,
  limiting: 'Both', yield_moles: 2, yield_mass: 36.03,
  excess_moles: 0, excess_mass: 0, diatomic_messages: [],
};

describe('StoichResultPanel', () => {
  it('renders balanced equation and yield with stoichiometric limiting', () => {
    render(<StoichResultPanel symbolA="H" symbolB="O" productFormula="H₂O" result={base} />);
    expect(screen.getByText('2H + O → 2H₂O')).toBeInTheDocument();
    expect(screen.getByText('Yield')).toBeInTheDocument();
    expect(screen.getByText(/Stoichiometric/)).toBeInTheDocument();
  });

  it('omits coefficient when 1 and shows excess + limiting symbol', () => {
    const r: WasmStoichResult = {
      ...base, coeff_a: 1, coeff_b: 1, coeff_product: 1,
      limiting: 'A', excess_moles: 0.5, excess_mass: 1.0,
    };
    render(<StoichResultPanel symbolA="Na" symbolB="Cl" productFormula="NaCl" result={r} />);
    expect(screen.getByText('Na + Cl → NaCl')).toBeInTheDocument();
    expect(screen.getByText('Excess')).toBeInTheDocument();
    expect(screen.getByText('Limiting: Na')).toBeInTheDocument();
  });

  it('shows diatomic messages', () => {
    const r: WasmStoichResult = { ...base, diatomic_messages: ['Cl only exists as Cl₂'] };
    render(<StoichResultPanel symbolA="Na" symbolB="Cl" productFormula="NaCl" result={r} />);
    expect(screen.getByText('Cl only exists as Cl₂')).toBeInTheDocument();
  });
});
