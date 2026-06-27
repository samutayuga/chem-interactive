import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PeriodicTable } from '@periodic-table';
import type { ZoneState } from '../../canvas/types';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: () => ({ children, ...rest }: any) => <div {...rest}>{children}</div> }),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../canvas/hooks', () => ({ useIonicCanvas: vi.fn() }));

const pt = PeriodicTable.load();
vi.mock('../../wasm/hooks', () => ({ useWasm: () => pt }));

import { useIonicCanvas } from '../../canvas/hooks';
import { BridgeColumn } from '../BridgeColumn';

const hZone: ZoneState = {
  symbol: 'H', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 1, oxidationStates: [1, -1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const oZone: ZoneState = {
  symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

function mockState(overrides: Record<string, unknown>) {
  (useIonicCanvas as ReturnType<typeof vi.fn>).mockReturnValue({
    state: {
      canvasPhase: 'STOICHIOMETRY', bondingType: 'Covalent',
      slotA: hZone, slotB: oZone, quantityA: null, quantityB: null, ...overrides,
    },
    dispatch: vi.fn(),
  });
}

describe('BridgeColumn stoichiometry phase', () => {
  it('shows yield once both quantities entered', () => {
    mockState({
      quantityA: { value: 2, unit: 'mole' },
      quantityB: { value: 1, unit: 'mole' },
    });
    render(<BridgeColumn />);
    expect(screen.getByText('Yield')).toBeInTheDocument();
  });

  it('does not show yield until both quantities present', () => {
    mockState({ quantityA: { value: 2, unit: 'mole' }, quantityB: null });
    render(<BridgeColumn />);
    expect(screen.queryByText('Yield')).toBeNull();
  });
});
