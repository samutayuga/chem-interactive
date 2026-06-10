import { INITIAL_STATE } from './constants';
import type { IonicCanvasState, IonicAction, ZoneState, Side } from './types';

function otherSide(side: Side): Side {
  return side === 'cation' ? 'anion' : 'cation';
}

function getZone(state: IonicCanvasState, side: Side): ZoneState | null {
  return side === 'cation' ? state.cation : state.anion;
}

function setZone(state: IonicCanvasState, side: Side, zone: ZoneState | null): IonicCanvasState {
  return side === 'cation' ? { ...state, cation: zone } : { ...state, anion: zone };
}

export function ionicReducer(state: IonicCanvasState, action: IonicAction): IonicCanvasState {
  switch (action.type) {
    case 'DROP_ELEMENT': {
      const newZone: ZoneState = { ...action.zone, status: 'DEDUCING', wrongCount: 0 };
      const next = setZone(state, action.side, newZone);
      return { ...next, canvasPhase: 'DEDUCING_CHARGE', activeDeductionSide: action.side };
    }

    case 'SUBMIT_DEDUCTION': {
      const zone = getZone(state, action.side);
      if (!zone) return state;

      const computedCharge = action.loseOrGain === 'lose' ? action.count : -action.count;
      const sideIsCorrect = action.side === 'cation' ? computedCharge > 0 : computedCharge < 0;
      const isCorrect = sideIsCorrect && zone.oxidationStates.includes(computedCharge);

      if (!isCorrect) {
        const updated: ZoneState = { ...zone, wrongCount: zone.wrongCount + 1 };
        return setZone(state, action.side, updated);
      }

      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: computedCharge, wrongCount: 0 };
      const next = setZone(state, action.side, ionized);
      const other = getZone(next, otherSide(action.side));
      const phase = other?.status === 'IONIZED' ? 'READY_TO_CROSS' : 'SELECTING';
      return { ...next, canvasPhase: phase, activeDeductionSide: null };
    }

    case 'PICK_TM_CHARGE': {
      const zone = getZone(state, action.side);
      if (!zone) return state;
      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: action.charge };
      const next = setZone(state, action.side, ionized);
      const other = getZone(next, otherSide(action.side));
      const phase = other?.status === 'IONIZED' ? 'READY_TO_CROSS' : 'SELECTING';
      return { ...next, canvasPhase: phase, activeDeductionSide: null };
    }

    case 'CONFIRM_POLYATOMIC': {
      const zone = getZone(state, action.side);
      if (!zone) return state;
      const charge = zone.oxidationStates[0];
      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: charge };
      const next = setZone(state, action.side, ionized);
      const other = getZone(next, otherSide(action.side));
      const phase = other?.status === 'IONIZED' ? 'READY_TO_CROSS' : 'SELECTING';
      return { ...next, canvasPhase: phase, activeDeductionSide: null };
    }

    case 'TRIGGER_CROSSOVER':
      return { ...state, canvasPhase: 'ANIMATING_CROSSOVER' };

    case 'CROSSOVER_COMPLETE':
      return { ...state, canvasPhase: 'COMPLETE' };

    case 'RESET':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}
