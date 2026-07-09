// src/reaction/speciesMap.ts
import type { WasmSpecies, WasmQuantity } from '@periodic-table';
import type { ZoneState } from '../canvas/types';
import type { ReactantEntry } from '../stoich/types';

export function zoneToSpecies(z: ZoneState): WasmSpecies {
  return {
    symbol: z.symbol,
    is_polyatomic: z.isPolyatomic,
    charge: z.derivedCharge ?? undefined,
  };
}

export function qtyToWasm(q: ReactantEntry | null): WasmQuantity | undefined {
  return q ? { value: q.value, unit: q.unit } : undefined;
}
