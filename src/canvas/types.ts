export type Slot = 'A' | 'B';
export type BondingType = 'Ionic' | 'Covalent' | 'Metallic';
export type ElementClass = 'Metal' | 'NonMetal' | 'Metalloid';

export type CanvasPhase =
  | 'SELECTING'
  | 'SLOT_A_FILLED'
  | 'DEDUCING_CHARGE'
  | 'READY_TO_CROSS'
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
  canvasPhase:         CanvasPhase;
  bondingType:         BondingType | null;
  slotA:               ZoneState | null;
  slotB:               ZoneState | null;
  activeDeductionSlot: Slot | null;
}

export type CanvasAction =
  | { type: 'DROP_ELEMENT';       slot: Slot; zone: ZoneState }
  | { type: 'SUBMIT_DEDUCTION';   slot: Slot; loseOrGain: 'lose' | 'gain'; count: number }
  | { type: 'PICK_TM_CHARGE';     slot: Slot; charge: number }
  | { type: 'CONFIRM_POLYATOMIC'; slot: Slot }
  | { type: 'TRIGGER_CROSSOVER' }
  | { type: 'CROSSOVER_COMPLETE' }
  | { type: 'RESET' };
