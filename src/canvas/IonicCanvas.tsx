import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useIonicCanvas } from './hooks';
import { ElementTray } from '../tray/ElementTray';
import { DropZone } from '../zones/DropZone';
import { BridgeColumn } from '../bridge/BridgeColumn';
import type { ZoneState, Side } from './types';

export function IonicCanvas() {
  const { state, dispatch } = useIonicCanvas();

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith('dropzone-')) return;

    const side = overId.replace('dropzone-', '') as Side;
    const zoneState = active.data.current?.zoneState as ZoneState | undefined;
    if (!zoneState) return;

    // Guard: prevent drop if zone already filled or wrong polarity for NH4+
    const zoneFilled = side === 'cation' ? state.cation !== null : state.anion !== null;
    if (zoneFilled) return;
    if (zoneState.isPolyatomic && zoneState.oxidationStates.length > 0) {
      const charge = zoneState.oxidationStates[0];
      if (charge > 0 && side !== 'cation') return;
      if (charge < 0 && side !== 'anion') return;
    }

    dispatch({ type: 'DROP_ELEMENT', side, zone: zoneState });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen overflow-hidden">
        <ElementTray />
        <div className="flex flex-1 gap-3 p-4 overflow-hidden">
          <DropZone side="cation" />
          <BridgeColumn />
          <DropZone side="anion" />
        </div>
      </div>
    </DndContext>
  );
}
