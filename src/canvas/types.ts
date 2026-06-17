export type Slot = 'A' | 'B';
export type BondingType = 'Ionic' | 'Covalent' | 'Metallic';
export type ElementClass = 'Metal' | 'NonMetal' | 'Metalloid';

export type CanvasPhase =
  | 'SELECTING'
  | 'SLOT_A_FILLED'
  | 'EXPLAINING'
  | 'ANIMATING_CROSSOVER'
  | 'SHOWING_COVALENT'
  | 'SHOWING_METALLIC'
  | 'COMPLETE';

export interface ZoneState {
  symbol:           string;
  elementClass:     ElementClass;
  isPolyatomic:     boolean;
  isTransition:     boolean;
  valenceElectrons: number;
  oxidationStates:  number[];
  derivedCharge:    number | null;
  wrongCount:       number;
  status:           'NEUTRAL' | 'DEDUCING' | 'IONIZED';
}

export interface CanvasState {
  canvasPhase: CanvasPhase;
  bondingType: BondingType | null;
  slotA:       ZoneState | null;
  slotB:       ZoneState | null;
}

export type CanvasAction =
  | { type: 'DROP_ELEMENT';       slot: Slot; zone: ZoneState }
  | { type: 'PICK_TM_CHARGE';     slot: Slot; charge: number }
  | { type: 'DISMISS_EXPLANATION' }
  | { type: 'REPLACE_ELEMENT';    slot: Slot }
  | { type: 'CROSSOVER_COMPLETE' }
  | { type: 'RESET' };
