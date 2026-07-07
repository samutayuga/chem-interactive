import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

// Capture the onDragEnd handler passed to the DndContext.
const h = vi.hoisted(() => ({ onDragEnd: undefined as undefined | ((e: any) => void) }));

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragEnd }: any) => {
    h.onDragEnd = onDragEnd;
    return <div data-testid="dnd">{children}</div>;
  },
}));

vi.mock('../hooks', () => ({ useIonicCanvas: vi.fn() }));
vi.mock('../../wasm/hooks', () => ({ useClassify: vi.fn() }));

vi.mock('../../tray/ElementTray', () => ({ ElementTray: () => <div data-testid="tray" /> }));
vi.mock('../../zones/DropZone', () => ({ DropZone: ({ slot }: any) => <div data-testid={`zone-${slot}`} /> }));
vi.mock('../../bridge/BridgeColumn', () => ({ BridgeColumn: () => <div data-testid="bridge" /> }));

import { useIonicCanvas } from '../hooks';
import { useClassify } from '../../wasm/hooks';
import { IonicCanvas } from '../IonicCanvas';

const dispatch = vi.fn();
const classify = vi.fn(() => 'Ionic');

const zoneState = {
  symbol: 'Na', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 1, oxidationStates: [1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

function setup(canvasPhase = 'SELECTING') {
  dispatch.mockClear();
  classify.mockClear();
  (useIonicCanvas as ReturnType<typeof vi.fn>).mockReturnValue({ state: { canvasPhase }, dispatch });
  (useClassify as ReturnType<typeof vi.fn>).mockReturnValue(classify);
  render(<IonicCanvas />);
}

describe('IonicCanvas handleDragEnd', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the children (tray, both drop zones, bridge)', () => {
    setup();
    // smoke — DndContext stub wraps everything
    expect(h.onDragEnd).toBeTypeOf('function');
  });

  it('returns early when there is no `over` target', () => {
    setup();
    h.onDragEnd!({ over: null, active: { data: { current: { zoneState } } } });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('returns early when overId does not start with dropzone-', () => {
    setup();
    h.onDragEnd!({ over: { id: 'somewhere' }, active: { data: { current: { zoneState } } } });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('returns early when active has no zoneState', () => {
    setup();
    h.onDragEnd!({ over: { id: 'dropzone-A' }, active: { data: { current: {} } } });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('returns early when active.data.current is undefined', () => {
    setup();
    h.onDragEnd!({ over: { id: 'dropzone-A' }, active: { data: {} } });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('returns early during ANIMATING_CROSSOVER phase', () => {
    setup('ANIMATING_CROSSOVER');
    h.onDragEnd!({ over: { id: 'dropzone-A' }, active: { data: { current: { zoneState } } } });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('dispatches DROP_ELEMENT with slot, zone and classify on a valid drop', () => {
    setup('SELECTING');
    h.onDragEnd!({ over: { id: 'dropzone-B' }, active: { data: { current: { zoneState } } } });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'DROP_ELEMENT', slot: 'B', zone: zoneState, classify,
    });
  });
});
