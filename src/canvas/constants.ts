import type { IonicCanvasState } from './types';

export interface PolyatomicIon {
  symbol:  string;
  name:    string;
  charge:  number;
  formula: string;
}

export const POLYATOMIC_IONS: PolyatomicIon[] = [
  { symbol: 'OH',  name: 'Hydroxide',  charge: -1, formula: 'OH⁻'  },
  { symbol: 'NO₃', name: 'Nitrate',    charge: -1, formula: 'NO₃⁻' },
  { symbol: 'SO₄', name: 'Sulfate',    charge: -2, formula: 'SO₄²⁻'},
  { symbol: 'CO₃', name: 'Carbonate',  charge: -2, formula: 'CO₃²⁻'},
  { symbol: 'PO₄', name: 'Phosphate',  charge: -3, formula: 'PO₄³⁻'},
  { symbol: 'NH₄', name: 'Ammonium',   charge: +1, formula: 'NH₄⁺' },
];

export const INITIAL_STATE: IonicCanvasState = {
  canvasPhase:         'SELECTING',
  activeDeductionSide: null,
  cation:              null,
  anion:               null,
};
