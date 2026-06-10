import { useContext } from 'react';
import { IonicCanvasContext } from './IonicCanvasProvider';

export function useIonicCanvas() {
  const ctx = useContext(IonicCanvasContext);
  if (!ctx) throw new Error('useIonicCanvas must be used inside IonicCanvasProvider');
  return ctx;
}
