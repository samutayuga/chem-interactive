// src/canvas/__tests__/IonicCanvasProvider.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IonicCanvasProvider } from '../IonicCanvasProvider';
import { useIonicCanvas } from '../hooks';
import type { ZoneState } from '../types';

const mgZone: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, group: 0, period: 0, oxidationStates: [2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const clZone: ZoneState = {
  symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, group: 0, period: 0, oxidationStates: [-1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

function TestConsumer() {
  const { selectedElement, selectElement, clearSelection } = useIonicCanvas();
  return (
    <>
      <div data-testid="selected">{selectedElement?.symbol ?? 'none'}</div>
      <button onClick={(e) => { e.stopPropagation(); selectElement(mgZone); }}>select Mg</button>
      <button onClick={(e) => { e.stopPropagation(); selectElement(clZone); }}>select Cl</button>
      <button onClick={(e) => { e.stopPropagation(); clearSelection(); }}>clear</button>
    </>
  );
}

describe('IonicCanvasProvider selection', () => {
  it('selectedElement starts null', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    expect(screen.getByTestId('selected')).toHaveTextContent('none');
  });

  it('selectElement sets selectedElement', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    fireEvent.click(screen.getByText('select Mg'));
    expect(screen.getByTestId('selected')).toHaveTextContent('Mg');
  });

  it('selectElement replaces previous selection', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    fireEvent.click(screen.getByText('select Mg'));
    fireEvent.click(screen.getByText('select Cl'));
    expect(screen.getByTestId('selected')).toHaveTextContent('Cl');
  });

  it('clearSelection resets to null', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    fireEvent.click(screen.getByText('select Mg'));
    fireEvent.click(screen.getByText('clear'));
    expect(screen.getByTestId('selected')).toHaveTextContent('none');
  });

  it('document click clears selection', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    fireEvent.click(screen.getByText('select Mg'));
    fireEvent.click(document.body);
    expect(screen.getByTestId('selected')).toHaveTextContent('none');
  });
});
