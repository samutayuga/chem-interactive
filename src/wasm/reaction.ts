import { solve_compound_reaction } from '@periodic-table';
import type { WasmSpecies, WasmQuantity, WasmReactionResult } from '@periodic-table';

/**
 * Solve a compound reaction between two reactant zones (each 1-2 species —
 * bare elements or polyatomic ions, identified by symbol). Loads the bundled
 * periodic table on every call; no separate init step is needed since the
 * `pt_wasm` bundler target self-initialises on import.
 */
export function solveCompoundReaction(
  zone1: WasmSpecies[],
  zone2: WasmSpecies[],
  q1?: WasmQuantity,
  q2?: WasmQuantity,
): WasmReactionResult {
  return solve_compound_reaction(zone1, zone2, q1, q2);
}
