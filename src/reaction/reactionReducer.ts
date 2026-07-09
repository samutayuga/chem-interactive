import type { ZoneState } from '../canvas/types';
import type { ReactantEntry } from '../stoich/types';
import type { WasmReactionResult } from '@periodic-table';

export type Bin = 'A' | 'B';

export interface ReactionState {
  reactantA: ZoneState[];
  reactantB: ZoneState[];
  activeBin: Bin;
  qtyA: ReactantEntry | null;
  qtyB: ReactantEntry | null;
  result: WasmReactionResult | null;
}

export const INITIAL_REACTION_STATE: ReactionState = {
  reactantA: [], reactantB: [], activeBin: 'A', qtyA: null, qtyB: null, result: null,
};

export type ReactionAction =
  | { type: 'PICK_SPECIES';   zone: ZoneState }
  | { type: 'REMOVE_SPECIES'; bin: Bin; index: number }
  | { type: 'SET_ACTIVE_BIN'; bin: Bin }
  | { type: 'SET_TM_CHARGE';  bin: Bin; index: number; charge: number }
  | { type: 'SET_QTY';        bin: Bin; entry: ReactantEntry | null }
  | { type: 'SET_RESULT';     result: WasmReactionResult | null }
  | { type: 'RESET' };

const speciesKey = (bin: Bin) => (bin === 'A' ? 'reactantA' : 'reactantB') as 'reactantA' | 'reactantB';

export function reactionReducer(state: ReactionState, action: ReactionAction): ReactionState {
  switch (action.type) {
    case 'PICK_SPECIES': {
      const key = speciesKey(state.activeBin);
      if (state[key].length >= 2) return state;
      return { ...state, [key]: [...state[key], action.zone], result: null };
    }
    case 'REMOVE_SPECIES': {
      const key = speciesKey(action.bin);
      return { ...state, [key]: state[key].filter((_, i) => i !== action.index), result: null };
    }
    case 'SET_ACTIVE_BIN':
      return { ...state, activeBin: action.bin };
    case 'SET_TM_CHARGE': {
      const key = speciesKey(action.bin);
      return {
        ...state,
        [key]: state[key].map((z, i) => (i === action.index ? { ...z, derivedCharge: action.charge } : z)),
        result: null,
      };
    }
    case 'SET_QTY':
      // Null the result too: a stale solve (computed at extent 1 without a
      // quantity) must not be shown as if it reflected the new quantity.
      return { ...state, [action.bin === 'A' ? 'qtyA' : 'qtyB']: action.entry, result: null };
    case 'SET_RESULT':
      return { ...state, result: action.result };
    case 'RESET':
      return INITIAL_REACTION_STATE;
  }
}
