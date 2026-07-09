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

export function ReactionView() {
  const [state, dispatch] = useReducer(reactionReducer, INITIAL_REACTION_STATE);
  const pt = useWasm();
  const canSolve = state.reactantA.length > 0 && state.reactantB.length > 0;
  const showQuantities = state.qtyA != null || state.qtyB != null;

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
        <div className="grid grid-cols-2 gap-3">
          <ReactantBin
            label="A" species={state.reactantA} active={state.activeBin === 'A'} qty={state.qtyA}
            compound={binCompound(pt, state.reactantA)}
            onActivate={() => dispatch({ type: 'SET_ACTIVE_BIN', bin: 'A' })}
            onRemove={i => {
              if (i === -1) {
                // clear the whole bin: remove from the end so indices stay valid
                for (let idx = state.reactantA.length - 1; idx >= 0; idx--) {
                  dispatch({ type: 'REMOVE_SPECIES', bin: 'A', index: idx });
                }
              } else {
                dispatch({ type: 'REMOVE_SPECIES', bin: 'A', index: i });
              }
            }}
            onPickCharge={(i, c) => dispatch({ type: 'SET_TM_CHARGE', bin: 'A', index: i, charge: c })}
            onQty={e => dispatch({ type: 'SET_QTY', bin: 'A', entry: e })}
          />
          <ReactantBin
            label="B" species={state.reactantB} active={state.activeBin === 'B'} qty={state.qtyB}
            compound={binCompound(pt, state.reactantB)}
            onActivate={() => dispatch({ type: 'SET_ACTIVE_BIN', bin: 'B' })}
            onRemove={i => {
              if (i === -1) {
                // clear the whole bin: remove from the end so indices stay valid
                for (let idx = state.reactantB.length - 1; idx >= 0; idx--) {
                  dispatch({ type: 'REMOVE_SPECIES', bin: 'B', index: idx });
                }
              } else {
                dispatch({ type: 'REMOVE_SPECIES', bin: 'B', index: i });
              }
            }}
            onPickCharge={(i, c) => dispatch({ type: 'SET_TM_CHARGE', bin: 'B', index: i, charge: c })}
            onQty={e => dispatch({ type: 'SET_QTY', bin: 'B', entry: e })}
          />
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
        {state.result && <ReactionResultPanel result={state.result} showQuantities={showQuantities} />}
      </div>
    </div>
  );
}
