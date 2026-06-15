import { useRef, useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useIonicCanvas } from './hooks';
import { ElementTray } from '../tray/ElementTray';
import { DropZone } from '../zones/DropZone';
import { BridgeColumn } from '../bridge/BridgeColumn';
import type { ZoneState, Slot } from './types';

export function IonicCanvas() {
  const { state, dispatch } = useIonicCanvas();
  const [trayHeight, setTrayHeight] = useState(480);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith('dropzone-')) return;

    const slot = overId.replace('dropzone-', '') as Slot;
    const zoneState = active.data.current?.zoneState as ZoneState | undefined;
    if (!zoneState) return;

    if (state.canvasPhase === 'ANIMATING_CROSSOVER') return;

    dispatch({ type: 'DROP_ELEMENT', slot, zone: zoneState });
  };

  const onHandleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startY: e.clientY, startH: trayHeight };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const { startY, startH } = dragRef.current;
      const delta = ev.clientY - startY;
      setTrayHeight(Math.max(80, Math.min(600, startH + delta)));
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen">

        <div style={{ height: trayHeight, flexShrink: 0 }}>
          <ElementTray />
        </div>

        <div
          onMouseDown={onHandleMouseDown}
          className="h-2 flex items-center justify-center cursor-row-resize select-none shrink-0 group bg-transparent hover:bg-white/5 transition-colors"
        >
          <div className="w-12 h-1 rounded-full bg-white/20 group-hover:bg-white/50 transition-colors" />
        </div>

        <div className="flex flex-1 gap-3 p-4 overflow-y-auto items-start">
          <DropZone slot="A" />
          <BridgeColumn />
          <DropZone slot="B" />
        </div>

      </div>
    </DndContext>
  );
}
