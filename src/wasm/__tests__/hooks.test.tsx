import { describe, it, expect, beforeAll } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { PeriodicTable, type WasmElement } from '@periodic-table';
import { WasmContext } from '../WasmProvider';
import {
  useWasm,
  useAllElements,
  useElement,
  useClassify,
  usePolyatomicIons,
} from '../hooks';

let pt: PeriodicTable;
let elements: WasmElement[];

beforeAll(() => {
  pt = PeriodicTable.load();
  elements = pt.all() as WasmElement[];
});

function wrapper({ children }: { children: ReactNode }) {
  return (
    <WasmContext.Provider value={{ pt, elements }}>
      {children}
    </WasmContext.Provider>
  );
}

describe('wasm hooks inside a provider', () => {
  it('useWasm returns the PeriodicTable instance', () => {
    const { result } = renderHook(() => useWasm(), { wrapper });
    expect(result.current).toBe(pt);
  });

  it('useAllElements returns the elements array', () => {
    const { result } = renderHook(() => useAllElements(), { wrapper });
    expect(result.current).toBe(elements);
    expect(result.current.length).toBeGreaterThan(0);
  });

  it('useElement finds a known element by symbol', () => {
    const { result } = renderHook(() => useElement('Cl'), { wrapper });
    expect(result.current?.symbol).toBe('Cl');
  });

  it('useElement returns undefined for an unknown symbol', () => {
    const { result } = renderHook(() => useElement('Zz'), { wrapper });
    expect(result.current).toBeUndefined();
  });

  it('useClassify returns a bonding type for a reacting pair', () => {
    const { result } = renderHook(() => useClassify(), { wrapper });
    expect(result.current('Na', 'Cl')).toBe('Ionic');
  });

  it('useClassify returns null when no reaction is produced', () => {
    const { result } = renderHook(() => useClassify(), { wrapper });
    // an unknown symbol makes react() return undefined → hook coalesces to null
    expect(result.current('Zz', 'Cl')).toBeNull();
  });

  it('usePolyatomicIons returns the polyatomic ion list', () => {
    const { result } = renderHook(() => usePolyatomicIons(), { wrapper });
    expect(result.current).toHaveLength(6);
  });
});

describe('wasm hooks without a provider throw', () => {
  it('useWasm throws', () => {
    expect(() => renderHook(() => useWasm())).toThrow(
      'useWasm must be used inside WasmProvider',
    );
  });

  it('useAllElements throws', () => {
    expect(() => renderHook(() => useAllElements())).toThrow(
      'useAllElements must be used inside WasmProvider',
    );
  });

  it('useElement throws', () => {
    expect(() => renderHook(() => useElement('Cl'))).toThrow(
      'useElement must be used inside WasmProvider',
    );
  });

  it('useClassify throws', () => {
    expect(() => renderHook(() => useClassify())).toThrow(
      'useClassify must be used inside WasmProvider',
    );
  });

  it('usePolyatomicIons throws', () => {
    expect(() => renderHook(() => usePolyatomicIons())).toThrow(
      'usePolyatomicIons must be used inside WasmProvider',
    );
  });
});
