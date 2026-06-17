import { INITIAL_STATE } from './constants';
import type { CanvasState, CanvasAction, ZoneState, Slot, BondingType, ElementClass } from './types';

function getSlot(state: CanvasState, slot: Slot): ZoneState | null {
  return slot === 'A' ? state.slotA : state.slotB;
}

function setSlot(state: CanvasState, slot: Slot, zone: ZoneState | null): CanvasState {
  return slot === 'A' ? { ...state, slotA: zone } : { ...state, slotB: zone };
}

function otherSlot(slot: Slot): Slot {
  return slot === 'A' ? 'B' : 'A';
}

function determineBonding(a: ElementClass, b: ElementClass): BondingType {
  if (a === 'Metal' && b === 'Metal') return 'Metallic';
  if ((a === 'Metalloid' || a === 'NonMetal') && (b === 'Metalloid' || b === 'NonMetal')) return 'Covalent';
  return 'Ionic';
}

function autoIonize(zone: ZoneState): ZoneState {
  if (zone.isTransition) return { ...zone, status: 'DEDUCING' };
  if (!zone.oxidationStates.length) return { ...zone, status: 'DEDUCING' };
  return { ...zone, status: 'IONIZED', derivedCharge: zone.oxidationStates[0] };
}

export function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {

    case 'DROP_ELEMENT': {
      const newZone: ZoneState = { ...action.zone, status: 'NEUTRAL', wrongCount: 0 };

      // Both slots filled → new drop resets the other slot and restarts
      if (state.slotA !== null && state.slotB !== null) {
        const next    = setSlot(state, action.slot, newZone);
        const cleared = setSlot(next, otherSlot(action.slot), null);
        return { ...cleared, canvasPhase: 'SLOT_A_FILLED', bondingType: null };
      }

      const next = setSlot(state, action.slot, newZone);
      const other = getSlot(next, otherSlot(action.slot));

      if (!other) {
        return { ...next, canvasPhase: 'SLOT_A_FILLED', bondingType: null };
      }

      // Polyatomic ions always form ionic compounds
      const bondingType = (newZone.isPolyatomic || other.isPolyatomic)
        ? 'Ionic'
        : determineBonding(newZone.elementClass, other.elementClass);

      if (bondingType === 'Covalent' || bondingType === 'Metallic') {
        return { ...next, bondingType, canvasPhase: 'EXPLAINING' };
      }

      // Ionic — auto-ionise both slots immediately
      const ionizedNew   = autoIonize(newZone);
      const ionizedOther = autoIonize(other);
      const slotA = action.slot === 'A' ? ionizedNew : ionizedOther;
      const slotB = action.slot === 'B' ? ionizedNew : ionizedOther;
      return { ...next, slotA, slotB, bondingType, canvasPhase: 'EXPLAINING' };
    }

    case 'PICK_TM_CHARGE': {
      const zone = getSlot(state, action.slot);
      if (!zone) return state;
      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: action.charge };
      return setSlot(state, action.slot, ionized);
    }

    case 'DISMISS_EXPLANATION': {
      if (
        state.bondingType === 'Ionic' &&
        (state.slotA?.status === 'DEDUCING' || state.slotB?.status === 'DEDUCING')
      ) return state;
      if (state.bondingType === 'Ionic')    return { ...state, canvasPhase: 'ANIMATING_CROSSOVER' };
      if (state.bondingType === 'Covalent') return { ...state, canvasPhase: 'SHOWING_COVALENT' };
      if (state.bondingType === 'Metallic') return { ...state, canvasPhase: 'SHOWING_METALLIC' };
      return state;
    }

    case 'REPLACE_ELEMENT': {
      const other = getSlot(state, otherSlot(action.slot));
      const resetOther = other
        ? { ...other, status: 'NEUTRAL' as const, derivedCharge: null, wrongCount: 0 }
        : null;
      const cleared = setSlot(state, action.slot, null);
      const reset   = setSlot(cleared, otherSlot(action.slot), resetOther);
      return { ...reset, canvasPhase: resetOther ? 'SLOT_A_FILLED' : 'SELECTING', bondingType: null };
    }

    case 'CROSSOVER_COMPLETE':
      return { ...state, canvasPhase: 'COMPLETE' };

    case 'RESET':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}
