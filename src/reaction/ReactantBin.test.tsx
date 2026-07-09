import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactantBin } from './ReactantBin';
import type { ZoneState } from '../canvas/types';

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

const noop = () => {};

it('renders a chip per species and fires onRemove', async () => {
  const onRemove = vi.fn();
  render(<ReactantBin label="A" species={[z('Na')]} active qty={null} compound={null}
    onActivate={noop} onRemove={onRemove} onPickCharge={noop} onQty={noop} />);
  expect(screen.getByText('Na')).toBeInTheDocument();
  await userEvent.click(screen.getByText('×'));
  expect(onRemove).toHaveBeenCalledWith(0);
});

it('shows the TM charge picker for an unresolved transition metal and fires onPickCharge', async () => {
  const onPickCharge = vi.fn();
  render(<ReactantBin label="B" species={[z('Cu', { isTransition: true, oxidationStates: [1, 2] })]} active={false} qty={null} compound={null}
    onActivate={noop} onRemove={noop} onPickCharge={onPickCharge} onQty={noop} />);
  await userEvent.click(screen.getByText('Cu²+'));
  expect(onPickCharge).toHaveBeenCalledWith(0, 2);
});

it('fires onActivate when the bin is clicked', async () => {
  const onActivate = vi.fn();
  render(<ReactantBin label="A" species={[]} active={false} qty={null} compound={null}
    onActivate={onActivate} onRemove={noop} onPickCharge={noop} onQty={noop} />);
  await userEvent.click(screen.getByText(/Reactant A/));
  expect(onActivate).toHaveBeenCalled();
});

it('renders a single compound chip when compound is set', () => {
  render(<ReactantBin label="A" species={[z('Mg', { derivedCharge: 2 }), z('Cl', { derivedCharge: -1 })]}
    active qty={null} compound="MgCl₂"
    onActivate={noop} onRemove={noop} onPickCharge={noop} onQty={noop} />);
  expect(screen.getByText('MgCl₂')).toBeInTheDocument();
  // the individual element chips are not rendered
  expect(screen.queryByText('Mg')).not.toBeInTheDocument();
});

it('compound chip × clears the bin via onRemove(-1)', async () => {
  const onRemove = vi.fn();
  render(<ReactantBin label="A" species={[z('Mg', { derivedCharge: 2 }), z('Cl', { derivedCharge: -1 })]}
    active qty={null} compound="MgCl₂"
    onActivate={noop} onRemove={onRemove} onPickCharge={noop} onQty={noop} />);
  await userEvent.click(screen.getByText('×'));
  expect(onRemove).toHaveBeenCalledWith(-1);
});
