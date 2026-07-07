import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { PeriodicTable } from '@periodic-table';
import { WasmContext } from '../WasmProvider';
import { usePolyatomicIons } from '../hooks';

const pt = PeriodicTable.load();
const elements = pt.all() as never[];

function WasmTestProvider({ children }: { children: ReactNode }) {
  return <WasmContext.Provider value={{ pt, elements }}>{children}</WasmContext.Provider>;
}

describe('usePolyatomicIons', () => {
  it('exposes 6 wasm polyatomic ions', () => {
    const { result } = renderHook(() => usePolyatomicIons(), { wrapper: WasmTestProvider });
    expect(result.current).toHaveLength(6);
    expect(result.current.map(i => i.symbol)).toContain('NH₄');
  });

  it('carries charge and formula from wasm', () => {
    const { result } = renderHook(() => usePolyatomicIons(), { wrapper: WasmTestProvider });
    const sulfate = result.current.find(i => i.symbol === 'SO₄')!;
    expect(sulfate.charge).toBe(-2);
    expect(sulfate.name).toBe('Sulfate');
  });
});
