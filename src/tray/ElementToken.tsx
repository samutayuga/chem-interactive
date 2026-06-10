import { useDraggable } from '@dnd-kit/core';
import type { WasmElement } from '@periodic-table';
import { parseValenceElectrons, isTransitionMetal } from '../utils/valence';
import { POLYATOMIC_IONS } from '../canvas/constants';
import type { ZoneState } from '../canvas/types';

interface Props {
  element: WasmElement;
  disabled?: boolean;
}

export function makeZoneState(el: WasmElement): ZoneState {
  return {
    symbol:           el.symbol,
    isPolyatomic:     false,
    isTransition:     isTransitionMetal(el.group),
    valenceElectrons: parseValenceElectrons(el.electron_configuration, el.group),
    oxidationStates:  el.oxidation_states,
    derivedCharge:    null,
    wrongCount:       0,
    status:           'NEUTRAL',
  };
}

export function ElementToken({ element, disabled = false }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `element-${element.symbol}`,
    data: { zoneState: makeZoneState(element) },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'flex flex-col items-center justify-center',
        'w-16 h-16 rounded-lg border cursor-grab select-none',
        'border-accent/40 bg-surface hover:border-accent',
        'transition-all duration-150',
        isDragging ? 'opacity-30 scale-95' : 'opacity-100',
        disabled ? 'opacity-20 cursor-not-allowed pointer-events-none' : '',
      ].join(' ')}
    >
      <span className="text-xs text-muted">{element.atomic_number}</span>
      <span className="text-lg font-bold text-white leading-none">{element.symbol}</span>
      <span className="text-[10px] text-muted truncate w-full text-center px-1">{element.name}</span>
    </div>
  );
}

interface PolyTokenProps {
  ion: typeof POLYATOMIC_IONS[0];
  disabled?: boolean;
}

export function PolyatomicToken({ ion, disabled = false }: PolyTokenProps) {
  const zoneState: ZoneState = {
    symbol:           ion.symbol,
    isPolyatomic:     true,
    isTransition:     false,
    valenceElectrons: 0,
    oxidationStates:  [ion.charge],
    derivedCharge:    null,
    wrongCount:       0,
    status:           'NEUTRAL',
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `poly-${ion.symbol}`,
    data: { zoneState },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'flex flex-col items-center justify-center',
        'px-3 h-16 rounded-lg border cursor-grab select-none',
        'border-anion/40 bg-surface hover:border-anion',
        'transition-all duration-150',
        isDragging ? 'opacity-30' : 'opacity-100',
        disabled ? 'opacity-20 cursor-not-allowed pointer-events-none' : '',
      ].join(' ')}
    >
      <span className="text-base font-bold text-white">{ion.formula}</span>
      <span className="text-[10px] text-muted">{ion.name}</span>
    </div>
  );
}
