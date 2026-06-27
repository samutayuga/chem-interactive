export type QuantityUnit = 'mole' | 'mass';

export interface ReactantEntry {
  value: number;
  unit: QuantityUnit;
}

export type { WasmStoichResult } from '@periodic-table';
