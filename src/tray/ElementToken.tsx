import { useDraggable } from '@dnd-kit/core';
import Tooltip from '@mui/material/Tooltip';
import type { WasmElement } from '@periodic-table';
import { parseValenceElectrons } from '../utils/valence';
import { elementClassColor } from '../utils/elementColor';
import { POLYATOMIC_IONS } from '../canvas/constants';
import type { ZoneState, ElementClass } from '../canvas/types';
import { useIonicCanvas } from '../canvas/hooks';

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
        // istanbul ignore next
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

export type BondHint = 'ionic' | 'covalent' | 'metallic' | 'none' | null;

const HINT_BG: Record<string, string> = {
  ionic:    'rgba(59, 130, 246, 0.35)',   // blue-500
  covalent: 'rgba(34, 197, 94,  0.35)',   // green-500
  metallic: 'rgba(249, 115, 22, 0.35)',   // orange-500
};

interface Props {
  element: WasmElement;
  disabled?: boolean;
  size?: 'sm' | 'md';
  bondHint?: BondHint;
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

export function ElementToken({ element, disabled = false, size = 'md', bondHint }: Props) {
  const { selectedElement, selectElement, clearSelection } = useIonicCanvas();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `element-${element.symbol}`,
    data: { zoneState: makeZoneState(element) },
    disabled: disabled || bondHint === 'none',
  });

  const color = elementClassColor(element.class);
  const isSm = size === 'sm';
  const bgColor = bondHint && bondHint !== 'none' ? HINT_BG[bondHint] : undefined;
  const isSelected = selectedElement?.symbol === element.symbol;
  const isInactive = disabled || bondHint === 'none';

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isInactive) return;
    if (isSelected) {
      clearSelection();
    } else {
      selectElement(makeZoneState(element));
    }
  }

  return (
    <Tooltip title={<ElementTooltip element={element} />} placement="bottom" arrow enterDelay={300}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={handleClick}
        className={[
          'group flex flex-col items-center justify-center',
          // responsive sizing: xs on mobile, sm on md+
          isSm
            ? 'w-8 h-8 md:w-14 md:h-14 rounded-md border cursor-grab select-none'
            : 'w-16 h-16 rounded-lg border cursor-grab select-none',
          'bg-surface transition-all duration-150',
          'hover:scale-110 hover:z-10',
          isDragging  ? 'opacity-30 scale-95' : 'opacity-100',
          isInactive  ? 'opacity-20 cursor-not-allowed pointer-events-none' : '',
          isSelected  ? 'ring-2 ring-white/80' : '',
          !isSelected && selectedElement && !isDragging ? 'opacity-50' : '',
        ].join(' ')}
        style={{
          borderColor: color + '55',
          backgroundColor: bgColor,
        }}
        onMouseEnter={e => { if (!isInactive) (e.currentTarget as HTMLDivElement).style.borderColor = color; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color + '55'; }}
      >
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-end leading-none mr-0.5">
            <span className={`${isSm ? 'hidden md:block text-[7px] group-hover:text-[9px]' : 'text-[9px] group-hover:text-[11px]'} text-white/65 group-hover:text-white transition-all duration-150`}>{element.mass_number}</span>
            <span className={`${isSm ? 'hidden md:block text-[7px] group-hover:text-[9px]' : 'text-[9px] group-hover:text-[11px]'} text-white/65 group-hover:text-white transition-all duration-150`}>{element.atomic_number}</span>
          </div>
          <span className={`${isSm ? 'text-[10px] md:text-sm' : 'text-xl'} font-bold leading-none transition-all duration-150`} style={{ color }}>{element.symbol}</span>
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
  const { selectedElement, selectElement, clearSelection } = useIonicCanvas();
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

  const isSelected = selectedElement?.symbol === ion.symbol;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (disabled) return;
    if (isSelected) {
      clearSelection();
    } else {
      selectElement(zoneState);
    }
  }

  return (
    <Tooltip title={ion.name} placement="bottom" arrow enterDelay={300}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={handleClick}
        className={[
          'flex flex-col items-center justify-center',
          'px-3 h-16 rounded-lg border cursor-grab select-none',
          'border-anion/40 bg-surface hover:border-anion',
          'transition-all duration-150',
          isDragging ? 'opacity-30' : 'opacity-100',
          disabled    ? 'opacity-20 cursor-not-allowed pointer-events-none' : '',
          isSelected  ? 'ring-2 ring-white/80' : '',
          !isSelected && selectedElement ? 'opacity-50' : '',
        ].join(' ')}
      >
        <span className="text-base font-bold text-white">{ion.formula}</span>
      </div>
    </Tooltip>
  );
}
