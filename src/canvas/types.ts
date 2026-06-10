export type Side = 'cation' | 'anion';
export type CanvasPhase =
  | 'SELECTING'
  | 'DEDUCING_CHARGE'
  | 'READY_TO_CROSS'
  | 'ANIMATING_CROSSOVER'
  | 'COMPLETE';

export interface ZoneState {
  symbol:           string;
  isPolyatomic:     boolean;
  isTransition:     boolean;
  valenceElectrons: number;
  oxidationStates:  number[];
  derivedCharge:    number | null;
  wrongCount:       number;
  status:           'NEUTRAL' | 'DEDUCING' | 'IONIZED';
}

export interface IonicCanvasState {
  canvasPhase:         CanvasPhase;
  activeDeductionSide: Side | null;
  cation:              ZoneState | null;
  anion:               ZoneState | null;
}

export type IonicAction =
  | { type: 'DROP_ELEMENT';        side: Side; zone: ZoneState }
  | { type: 'SUBMIT_DEDUCTION';    side: Side; loseOrGain: 'lose' | 'gain'; count: number }
  | { type: 'PICK_TM_CHARGE';      side: Side; charge: number }
  | { type: 'CONFIRM_POLYATOMIC';  side: Side }
  | { type: 'TRIGGER_CROSSOVER' }
  | { type: 'CROSSOVER_COMPLETE' }
  | { type: 'RESET' };
