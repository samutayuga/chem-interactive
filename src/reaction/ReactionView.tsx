// src/reaction/ReactionView.tsx
import { useReducer } from 'react';
import { ElementTray } from '../tray/ElementTray';
import { ReactantBin } from './ReactantBin';
import { ReactionResultPanel } from './ReactionResultPanel';
import { reactionReducer, INITIAL_REACTION_STATE } from './reactionReducer';
import { zoneToSpecies, qtyToWasm } from './speciesMap';
import { solveCompoundReaction } from '../wasm/reaction';
import { useWasm } from '../wasm/hooks';
import { binCompound } from './binFormula';
import { binReactant } from './binReactant';
import { diagnoseReaction } from './diagnose';
import type { Bin } from './reactionReducer';

const BINS: Bin[] = ['A', 'B'];

export function ReactionView() {
  const [state, dispatch] = useReducer(reactionReducer, INITIAL_REACTION_STATE);
  const pt = useWasm();
  const canSolve = state.reactantA.length > 0 && state.reactantB.length > 0;
  const showQuantities = state.qtyA != null || state.qtyB != null;
  const diagnosis = state.result
    ? diagnoseReaction(pt, state.reactantA, state.reactantB, state.result)
    : null;

  const speciesOf = (bin: Bin) => (bin === 'A' ? state.reactantA : state.reactantB);

  // Remove one species (index ≥ 0) or clear the whole bin (index === -1),
  // deleting from the end so earlier indices stay valid mid-loop.
  const removeFromBin = (bin: Bin, index: number) => {
    if (index !== -1) return dispatch({ type: 'REMOVE_SPECIES', bin, index });
    for (let i = speciesOf(bin).length - 1; i >= 0; i--) {
      dispatch({ type: 'REMOVE_SPECIES', bin, index: i });
    }
  };

  function solve() {
    const result = solveCompoundReaction(
      state.reactantA.map(zoneToSpecies),
      state.reactantB.map(zoneToSpecies),
      qtyToWasm(state.qtyA),
      qtyToWasm(state.qtyB),
    );
    dispatch({ type: 'SET_RESULT', result });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 max-h-[45vh] overflow-auto">
        <ElementTray onPick={z => dispatch({ type: 'PICK_SPECIES', zone: z })} />
      </div>
      <div className="flex-1 overflow-auto p-3 flex flex-col gap-3 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
          {BINS.map(bin => (
            <ReactantBin
              key={bin}
              label={bin} species={speciesOf(bin)} active={state.activeBin === bin}
              qty={bin === 'A' ? state.qtyA : state.qtyB}
              compound={binCompound(pt, speciesOf(bin))}
              reactant={binReactant(pt, speciesOf(bin))}
              onActivate={() => dispatch({ type: 'SET_ACTIVE_BIN', bin })}
              onRemove={i => removeFromBin(bin, i)}
              onPickCharge={(i, c) => dispatch({ type: 'SET_TM_CHARGE', bin, index: i, charge: c })}
              onQty={e => dispatch({ type: 'SET_QTY', bin, entry: e })}
            />
          ))}
        </div>
        <div className="flex gap-2 justify-center">
          <button
            disabled={!canSolve} onClick={solve}
            className="text-xs px-4 py-1 rounded-full border border-accent/60 text-accent hover:bg-accent hover:text-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >Solve</button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="text-xs px-4 py-1 rounded-full border border-muted/60 text-muted hover:bg-muted/20 transition-colors"
          >Reset</button>
        </div>
        {state.result && <ReactionResultPanel result={state.result} showQuantities={showQuantities} diagnosis={diagnosis} />}
      </div>
    </div>
  );
}
