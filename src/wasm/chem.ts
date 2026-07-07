import type {
  PeriodicTable, WasmReaction, WasmStoichResult,
  WasmReactantInput, WasmPolyatomicIon,
} from '@periodic-table';

export function classifyReaction(pt: PeriodicTable, a: string, b: string): WasmReaction | undefined {
  return pt.react(a, b);
}

export function solveStoich(pt: PeriodicTable, a: WasmReactantInput, b: WasmReactantInput): WasmStoichResult | undefined {
  return pt.solve_stoichiometry(a, b);
}

export function listPolyatomicIons(pt: PeriodicTable): WasmPolyatomicIon[] {
  return pt.polyatomic_ions() as WasmPolyatomicIon[];
}

export function valenceOf(pt: PeriodicTable, symbol: string): number | undefined {
  return pt.valence_electrons(symbol);
}

export function productStateAt(pt: PeriodicTable, symbol: string, kelvin: number): string | undefined {
  return pt.state_at(symbol, kelvin);
}
