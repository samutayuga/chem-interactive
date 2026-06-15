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
  if (a === 'NonMetal' && b === 'NonMetal') return 'Covalent';
  if ((a === 'Metalloid' || a === 'NonMetal') && (b === 'Metalloid' || b === 'NonMetal')) return 'Covalent';
  return 'Ionic';
}

function isCationSlot(zone: ZoneState): boolean {
  return zone.elementClass === 'Metal' || zone.elementClass === 'Metalloid';
}

export function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {

    case 'DROP_ELEMENT': {
      const newZone: ZoneState = { ...action.zone, status: 'DEDUCING', wrongCount: 0 };
      const next = setSlot(state, action.slot, newZone);
      const other = getSlot(next, otherSlot(action.slot));

      if (!other) {
        return { ...next, canvasPhase: 'SLOT_A_FILLED', bondingType: null, activeDeductionSlot: null };
      }

      const bondingType = determineBonding(newZone.elementClass, other.elementClass);

      if (bondingType === 'Covalent') {
        return { ...next, bondingType, canvasPhase: 'SHOWING_COVALENT', activeDeductionSlot: null };
      }
      if (bondingType === 'Metallic') {
        return { ...next, bondingType, canvasPhase: 'SHOWING_METALLIC', activeDeductionSlot: null };
      }
      // Ionic — start deduction on the newly dropped element
      return { ...next, bondingType, canvasPhase: 'DEDUCING_CHARGE', activeDeductionSlot: action.slot };
    }

    case 'SUBMIT_DEDUCTION': {
      const zone = getSlot(state, action.slot);
      if (!zone) return state;

      const computedCharge = action.loseOrGain === 'lose' ? action.count : -action.count;
      const mustBeCation = isCationSlot(zone);
      const sideCorrect = mustBeCation ? computedCharge > 0 : computedCharge < 0;
      const isCorrect = sideCorrect && zone.oxidationStates.includes(computedCharge);

      if (!isCorrect) {
        return setSlot(state, action.slot, { ...zone, wrongCount: zone.wrongCount + 1 });
      }

      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: computedCharge, wrongCount: 0 };
      const next = setSlot(state, action.slot, ionized);
      const other = getSlot(next, otherSlot(action.slot));

      if (other?.status === 'IONIZED') {
        return { ...next, canvasPhase: 'READY_TO_CROSS', activeDeductionSlot: null };
      }
      // Move deduction to other slot
      return { ...next, canvasPhase: 'DEDUCING_CHARGE', activeDeductionSlot: otherSlot(action.slot) };
    }

    case 'PICK_TM_CHARGE': {
      const zone = getSlot(state, action.slot);
      if (!zone) return state;
      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: action.charge };
      const next = setSlot(state, action.slot, ionized);
      const other = getSlot(next, otherSlot(action.slot));

      if (other?.status === 'IONIZED') {
        return { ...next, canvasPhase: 'READY_TO_CROSS', activeDeductionSlot: null };
      }
      return { ...next, canvasPhase: 'DEDUCING_CHARGE', activeDeductionSlot: otherSlot(action.slot) };
    }

    case 'CONFIRM_POLYATOMIC': {
      const zone = getSlot(state, action.slot);
      if (!zone) return state;
      const charge = zone.oxidationStates[0];
      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: charge };
      const next = setSlot(state, action.slot, ionized);
      const other = getSlot(next, otherSlot(action.slot));

      if (other?.status === 'IONIZED') {
        return { ...next, canvasPhase: 'READY_TO_CROSS', activeDeductionSlot: null };
      }
      return { ...next, canvasPhase: 'DEDUCING_CHARGE', activeDeductionSlot: otherSlot(action.slot) };
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
