import { useDraggable } from '@dnd-kit/core';
import Tooltip from '@mui/material/Tooltip';
import type { WasmElement } from '@periodic-table';
import { parseValenceElectrons } from '../utils/valence';
import { elementClassColor } from '../utils/elementColor';
import { POLYATOMIC_IONS } from '../canvas/constants';
import type { ZoneState, ElementClass } from '../canvas/types';

const ORBITAL_COLOR: Record<string, string> = {
  s: '#80cfff',
  p: '#88ff99',
  d: '#ffc060',
  f: '#ff90d0',
};

function ElectronConfigDisplay({ config }: { config: string }) {
  const parts = config.split(' ');
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6 }}>
      {parts.map((part, i) => {
        if (part.startsWith('[')) {
          return <span key={i} style={{ color: '#aaa' }}>{part} </span>;
        }
        const m = part.match(/^(\d)([spdf])(\d+)$/);
        if (!m) return <span key={i}>{part} </span>;
        const clr = ORBITAL_COLOR[m[2]] ?? '#fff';
        return (
          <span key={i}>
            <span style={{ color: '#ccc' }}>{m[1]}</span>
            <span style={{ color: clr, fontWeight: 'bold' }}>{m[2]}</span>
            <sup style={{ color: clr }}>{m[3]}</sup>
            {i < parts.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}

function ElementTooltip({ element }: { element: WasmElement }) {
  return (
    <div style={{ padding: '2px 0' }}>
      <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>{element.name}</div>
      <ElectronConfigDisplay config={element.electron_configuration} />
    </div>
  );
}

interface Props {
  element: WasmElement;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function makeZoneState(el: WasmElement): ZoneState {
  return {
    symbol:           el.symbol,
    elementClass:     el.class as ElementClass,
    isPolyatomic:     false,
    isTransition:     el.block === 'd',
    valenceElectrons: parseValenceElectrons(el.electron_configuration, el.group),
    oxidationStates:  el.oxidation_states,
    derivedCharge:    null,
    wrongCount:       0,
    status:           'NEUTRAL',
  };
}

export function ElementToken({ element, disabled = false, size = 'md' }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `element-${element.symbol}`,
    data: { zoneState: makeZoneState(element) },
    disabled,
  });

  const color = elementClassColor(element.class);
  const isSm = size === 'sm';

  return (
    <Tooltip title={<ElementTooltip element={element} />} placement="bottom" arrow enterDelay={300}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={[
          'group flex flex-col items-center justify-center',
          isSm ? 'rounded-md border cursor-grab select-none' : 'w-16 h-16 rounded-lg border cursor-grab select-none',
          'bg-surface transition-all duration-150',
          'hover:scale-110 hover:z-10',
          isDragging ? 'opacity-30 scale-95' : 'opacity-100',
          disabled ? 'opacity-20 cursor-not-allowed pointer-events-none' : '',
        ].join(' ')}
        style={{
          borderColor: color + '55',
          ...(isSm ? { width: '3.5rem', height: '3.5rem' } : {}),
        }}
        onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLDivElement).style.borderColor = color; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color + '55'; }}
      >
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-end leading-none mr-0.5">
            <span className={`${isSm ? 'text-[7px] group-hover:text-[9px]' : 'text-[9px] group-hover:text-[11px]'} text-white/65 group-hover:text-white transition-all duration-150`}>{element.mass_number}</span>
            <span className={`${isSm ? 'text-[7px] group-hover:text-[9px]' : 'text-[9px] group-hover:text-[11px]'} text-white/65 group-hover:text-white transition-all duration-150`}>{element.atomic_number}</span>
          </div>
          <span className={`${isSm ? 'text-sm' : 'text-xl'} font-bold leading-none transition-all duration-150`} style={{ color }}>{element.symbol}</span>
        </div>
      </div>
    </Tooltip>
  );
}

interface PolyTokenProps {
  ion: typeof POLYATOMIC_IONS[0];
  disabled?: boolean;
}

export function PolyatomicToken({ ion, disabled = false }: PolyTokenProps) {
  const zoneState: ZoneState = {
    symbol:           ion.symbol,
    elementClass:     'NonMetal',
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
    <Tooltip title={ion.name} placement="bottom" arrow enterDelay={300}>
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
      </div>
    </Tooltip>
  );
}
