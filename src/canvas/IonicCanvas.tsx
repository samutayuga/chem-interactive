import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useIonicCanvas } from './hooks';
import { ElementTray } from '../tray/ElementTray';
import { DropZone } from '../zones/DropZone';
import { BridgeColumn } from '../bridge/BridgeColumn';
import type { ZoneState, Slot } from './types';

export function IonicCanvas() {
  const { state, dispatch } = useIonicCanvas();

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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen">

        <div style={{ height: '38.2vh' }} className="shrink-0">
          <ElementTray />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-[20.6vh] shrink-0" />
          <div className="flex items-start overflow-y-auto">
            <div className="w-1/3 px-3">
              <DropZone slot="A" />
            </div>
            <div className="w-1/3 px-3">
              <BridgeColumn />
            </div>
            <div className="w-1/3 px-3">
              <DropZone slot="B" />
            </div>
          </div>
        </div>

      </div>
    </DndContext>
  );
}
