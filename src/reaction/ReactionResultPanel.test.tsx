// src/reaction/ReactionResultPanel.test.tsx
import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactionResultPanel } from './ReactionResultPanel';
import type { WasmReactionResult } from '@periodic-table';

const term = (coeff: number, formula: string): WasmReactionResult['products'][number] =>
  ({ coeff, formula, molar_mass: 0, composition: [] });

const base: WasmReactionResult = {
  feasible: true, reaction_class: 'DoubleDisplacement',
  reactants: [term(1, 'NaOH'), term(1, 'HCl')],
  products: [term(1, 'NaCl'), term(1, 'H₂O')],
  limiting: 'Both', yields: [[1, 58.44], [1, 18.02]], excess: [0, 0],
  messages: [], error: undefined, redox: undefined,
};

it('renders the balanced equation and class', () => {
  render(<ReactionResultPanel result={base} showQuantities={false} />);
  expect(screen.getByText(/NaOH \+ HCl → NaCl \+ H₂O/)).toBeInTheDocument();
  expect(screen.getByText('DoubleDisplacement')).toBeInTheDocument();
});

it('shows the diagnosis card and hides the equation when a diagnosis is given', () => {
  render(<ReactionResultPanel result={base} showQuantities
    diagnosis={{ reason: "Ne is a noble gas — inert, it won't react.", hint: 'pair with a metal', suggestions: [{ symbol: 'Na' }, { symbol: 'Cl' }] }} />);
  expect(screen.getByText(/Ne is a noble gas/)).toBeInTheDocument();
  expect(screen.getByText('Na')).toBeInTheDocument();
  expect(screen.getByText('Try:')).toBeInTheDocument();
  // the (dubious) balanced equation is suppressed
  expect(screen.queryByText(/NaOH \+ HCl/)).not.toBeInTheDocument();
});

it('hides yield rows when showQuantities is false', () => {
  render(<ReactionResultPanel result={base} showQuantities={false} />);
  expect(screen.queryByText(/mol/)).not.toBeInTheDocument();
});

it('shows yield rows when showQuantities is true', () => {
  render(<ReactionResultPanel result={base} showQuantities />);
  expect(screen.getByText(/58\.44 g/)).toBeInTheDocument();
});

it('renders the redox block with agents', () => {
  const redox: WasmReactionResult = {
    ...base, reaction_class: 'SingleDisplacement',
    redox: { is_redox: true, oxidising_agent: 'CuSO₄', reducing_agent: 'Zn',
      changes: [{ symbol: 'Zn', before: 0, after: 2, change: 'Oxidised', reactant_formula: 'Zn', product_formula: 'ZnSO₄' }],
      narrative: ['Zn is oxidised.'] },
  };
  render(<ReactionResultPanel result={redox} showQuantities={false} />);
  expect(screen.getByText(/Reducing agent: Zn/)).toBeInTheDocument();
  expect(screen.getByText(/Oxidising agent: CuSO₄/)).toBeInTheDocument();
});

it('shows error/messages when infeasible', () => {
  const infeasible: WasmReactionResult = {
    ...base, feasible: false, products: [], yields: [],
    messages: ['Cu cannot displace Zn (activity series).'], error: undefined,
  };
  render(<ReactionResultPanel result={infeasible} showQuantities={false} />);
  expect(screen.getByText(/activity series/)).toBeInTheDocument();
  expect(screen.queryByText(/→/)).not.toBeInTheDocument();
});
