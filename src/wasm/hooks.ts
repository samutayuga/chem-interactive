import { useContext } from 'react';
import { WasmContext } from './WasmProvider';
import type { WasmElement } from '@periodic-table';

export function useWasm() {
  const ctx = useContext(WasmContext);
  if (!ctx) throw new Error('useWasm must be used inside WasmProvider');
  return ctx.pt;
}

export function useAllElements(): WasmElement[] {
  const ctx = useContext(WasmContext);
  if (!ctx) throw new Error('useAllElements must be used inside WasmProvider');
  return ctx.elements;
}

export function useElement(symbol: string): WasmElement | undefined {
  const ctx = useContext(WasmContext);
  if (!ctx) throw new Error('useElement must be used inside WasmProvider');
  return ctx.elements.find(e => e.symbol === symbol);
}
