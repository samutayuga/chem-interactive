import { createContext, useReducer, type ReactNode } from 'react';
import { ionicReducer } from './reducer';
import { INITIAL_STATE } from './constants';
import type { IonicCanvasState, IonicAction } from './types';

interface IonicCanvasContextValue {
  state:    IonicCanvasState;
  dispatch: React.Dispatch<IonicAction>;
}

export const IonicCanvasContext = createContext<IonicCanvasContextValue | null>(null);

export function IonicCanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ionicReducer, INITIAL_STATE);
  return (
    <IonicCanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </IonicCanvasContext.Provider>
  );
}
