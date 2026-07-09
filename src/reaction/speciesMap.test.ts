// src/reaction/speciesMap.test.ts
import { describe, it, expect } from 'vitest';
import { zoneToSpecies, qtyToWasm } from './speciesMap';
import type { ZoneState } from '../canvas/types';

function zone(partial: Partial<ZoneState>): ZoneState {
  return {
    symbol: 'X', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
    valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
    wrongCount: 0, status: 'NEUTRAL', ...partial,
  };
}

describe('zoneToSpecies', () => {
  it('maps an element with no chosen charge to undefined charge', () => {
    expect(zoneToSpecies(zone({ symbol: 'Na' }))).toEqual({ symbol: 'Na', is_polyatomic: false, charge: undefined });
  });
  it('carries a chosen charge (transition metal)', () => {
    expect(zoneToSpecies(zone({ symbol: 'Cu', isTransition: true, derivedCharge: 2 })))
      .toEqual({ symbol: 'Cu', is_polyatomic: false, charge: 2 });
  });
  it('marks a polyatomic ion', () => {
    expect(zoneToSpecies(zone({ symbol: 'SO₄', isPolyatomic: true, derivedCharge: -2 })))
      .toEqual({ symbol: 'SO₄', is_polyatomic: true, charge: -2 });
  });
});

describe('qtyToWasm', () => {
  it('maps null to undefined', () => { expect(qtyToWasm(null)).toBeUndefined(); });
  it('maps a set quantity', () => { expect(qtyToWasm({ value: 2, unit: 'mole' })).toEqual({ value: 2, unit: 'mole' }); });
});
