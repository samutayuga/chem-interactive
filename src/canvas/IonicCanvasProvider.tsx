import { createContext, useReducer, useState, useEffect, useCallback, type ReactNode } from 'react';
import { canvasReducer } from './reducer';
import { INITIAL_STATE } from './constants';
import type { CanvasState, CanvasAction, ZoneState } from './types';

interface CanvasContextValue {
  state:           CanvasState;
  dispatch:        React.Dispatch<CanvasAction>;
  selectedElement: ZoneState | null;
  selectElement:   (z: ZoneState) => void;
  clearSelection:  () => void;
}

export const IonicCanvasContext = createContext<CanvasContextValue | null>(null);

export function IonicCanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, INITIAL_STATE);
  const [selectedElement, setSelectedElement] = useState<ZoneState | null>(null);

  const selectElement  = useCallback((z: ZoneState) => setSelectedElement(z), []);
  const clearSelection = useCallback(() => setSelectedElement(null), []);

  useEffect(() => {
    document.addEventListener('click', clearSelection);
    return () => document.removeEventListener('click', clearSelection);
  }, [clearSelection]);

  return (
    <IonicCanvasContext.Provider value={{ state, dispatch, selectedElement, selectElement, clearSelection }}>
      {children}
    </IonicCanvasContext.Provider>
  );
}
