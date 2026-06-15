import { createContext, useReducer, type ReactNode } from 'react';
import { canvasReducer } from './reducer';
import { INITIAL_STATE } from './constants';
import type { CanvasState, CanvasAction } from './types';

interface CanvasContextValue {
  state:    CanvasState;
  dispatch: React.Dispatch<CanvasAction>;
}

export const IonicCanvasContext = createContext<CanvasContextValue | null>(null);

export function IonicCanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, INITIAL_STATE);
  return (
    <IonicCanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </IonicCanvasContext.Provider>
  );
}
