declare module '@periodic-table' {
  export {
    PeriodicTable,
    WasmElement,
    WasmIsotope,
    WasmElementClass,
    WasmReaction,
    WasmCovalentStoich,
    WasmStoichResult,
    WasmReactantInput,
    WasmPolyatomicIon,
    solve_compound_reaction,
    WasmSpecies,
    WasmQuantity,
    WasmReactionResult,
    WasmTerm,
    WasmRedox,
    WasmElementRedox,
  } from './pkg/pt_wasm';
}
