import { useContext } from 'react';
import { WasmContext } from './WasmProvider';
import type { WasmElement, WasmPolyatomicIon } from '@periodic-table';
import type { BondingType } from '../canvas/types';
import { classifyReaction, listPolyatomicIons } from './chem';

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

/**
 * Returns a classifier that asks the wasm core for the bonding type of two
 * element symbols. Inject into DROP_ELEMENT so the reducer matches Rust.
 */
export function useClassify(): (a: string, b: string) => BondingType | null {
  const ctx = useContext(WasmContext);
  if (!ctx) throw new Error('useClassify must be used inside WasmProvider');
  return (a, b) => (classifyReaction(ctx.pt, a, b)?.bonding as BondingType | undefined) ?? null;
}

/** The six common polyatomic ions sourced from the wasm core. */
export function usePolyatomicIons(): WasmPolyatomicIon[] {
  const ctx = useContext(WasmContext);
  if (!ctx) throw new Error('usePolyatomicIons must be used inside WasmProvider');
  return listPolyatomicIons(ctx.pt);
}
