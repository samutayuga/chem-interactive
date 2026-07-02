import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { IonicCanvasContext } from '../IonicCanvasProvider';
import { useIonicCanvas } from '../hooks';

describe('useIonicCanvas', () => {
  it('throws when used without a provider', () => {
    expect(() => renderHook(() => useIonicCanvas())).toThrow(
      'useIonicCanvas must be used inside IonicCanvasProvider',
    );
  });

  it('returns the context value when inside a provider', () => {
    const value = {
      state: {} as never,
      dispatch: () => {},
      selectedElement: null,
      selectElement: () => {},
      clearSelection: () => {},
    };
    function wrapper({ children }: { children: ReactNode }) {
      return (
        <IonicCanvasContext.Provider value={value}>
          {children}
        </IonicCanvasContext.Provider>
      );
    }
    const { result } = renderHook(() => useIonicCanvas(), { wrapper });
    expect(result.current).toBe(value);
  });
});
