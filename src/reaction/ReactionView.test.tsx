// src/reaction/ReactionView.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasmProvider } from '../wasm/WasmProvider';
import { IonicCanvasProvider } from '../canvas/IonicCanvasProvider';
import { ReactionView } from './ReactionView';

function mount() {
  return render(
    <WasmProvider>
      <IonicCanvasProvider>
        <ReactionView />
      </IonicCanvasProvider>
    </WasmProvider>,
  );
}

describe('ReactionView (real wasm)', () => {
  it('solves NaOH + HCl → NaCl + H₂O (double displacement)', async () => {
    const u = userEvent.setup();
    mount();
    // wait for the wasm-loaded tray to render an element token
    await screen.findByText('Na', {}, { timeout: 15000 });

    await u.click(screen.getByText('Na'));                       // A ← Na
    await u.click(screen.getByText('Polyatomic Ions'));
    await u.click(screen.getByText(/OH/));                       // A ← OH
    await u.click(screen.getByText(/Reactant B/));               // activate B
    await u.click(screen.getByText('Elements'));
    await u.click(screen.getByText('H'));                        // B ← H
    await u.click(screen.getByText('Cl'));                       // B ← Cl

    // bin A collapses its two species (Na + OH) into one compound chip
    // NaOH now appears twice: the compound chip and the Ar/Mr mass line.
    expect((await screen.findAllByText('NaOH')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/[\d.]+ g\/mol/).length).toBeGreaterThan(0);

    await u.click(screen.getByText('Solve'));

    expect(await screen.findByText(/NaCl/)).toBeInTheDocument();
    expect(screen.getByText(/H₂O/)).toBeInTheDocument();
    expect(screen.getByText('DoubleDisplacement')).toBeInTheDocument();
  }, 30000);

  it('clears a compound bin when its chip × is clicked, and removes a lone species', async () => {
    const u = userEvent.setup();
    mount();
    await screen.findByText('Na', {}, { timeout: 15000 });

    // build the NaOH compound chip in bin A
    await u.click(screen.getByText('Na'));
    await u.click(screen.getByText('Polyatomic Ions'));
    await u.click(screen.getByText(/OH/));
    expect((await screen.findAllByText('NaOH')).length).toBeGreaterThan(0);

    // clear whole compound bin via the compound chip × → onRemove(-1) loop
    await u.click(screen.getByLabelText('clear compound'));
    expect(screen.queryByText('NaOH')).not.toBeInTheDocument();

    // add a single element, then remove it via its own × → onRemove(index)
    await u.click(screen.getByText('Elements'));
    await u.click(screen.getByText('Mg'));
    await u.click(screen.getByLabelText('remove Mg'));
    expect(screen.queryByLabelText('remove Mg')).not.toBeInTheDocument();
  }, 30000);

  it('blocks a noble gas on solve and suggests partners (Na + Ne)', async () => {
    const u = userEvent.setup();
    mount();
    await screen.findByText('Na', {}, { timeout: 15000 });

    await u.click(screen.getByText('Na'));                       // A ← Na
    await u.click(screen.getByText(/Reactant B/));               // activate B
    await u.click(screen.getByText('Ne'));                       // B ← Ne (noble gas)
    await u.click(screen.getByText('Solve'));

    expect(await screen.findByText(/Ne is a noble gas/)).toBeInTheDocument();
    expect(screen.getByText('Try:')).toBeInTheDocument();
  }, 30000);

  it('solves Zn + CuSO₄ and reports the redox agents', async () => {
    const u = userEvent.setup();
    mount();
    await screen.findByText('Zn', {}, { timeout: 15000 });

    await u.click(screen.getByText('Zn'));                       // A ← Zn (transition metal)
    await u.click(screen.getByText('Zn²+'));                     // pick Zn²⁺
    await u.click(screen.getByText(/Reactant B/));               // activate B
    await u.click(screen.getByText('Cu'));                       // B ← Cu (transition metal)
    await u.click(screen.getByText('Cu²+'));                     // pick Cu²⁺
    await u.click(screen.getByText('Polyatomic Ions'));
    await u.click(screen.getByText(/SO₄/));                      // B ← sulfate
    await u.click(screen.getByText('Solve'));

    expect(await screen.findByText(/Reducing agent: Zn/)).toBeInTheDocument();
    expect(screen.getByText(/Oxidising agent/)).toBeInTheDocument();
  }, 30000);
});
