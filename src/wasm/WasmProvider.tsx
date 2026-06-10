import {
  createContext, useContext, useEffect, useState,
  Component, type ReactNode, type ErrorInfo,
} from 'react';
import type { PeriodicTable, WasmElement } from '@periodic-table';

interface WasmContextValue {
  pt: PeriodicTable;
  elements: WasmElement[];
}

export const WasmContext = createContext<WasmContextValue | null>(null);

class WasmErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('WASM failed:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center h-screen bg-bg text-white text-center p-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Failed to load element data</h1>
            <p className="text-muted">Please refresh the page.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function WasmLoader({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<WasmContextValue | null>(null);

  useEffect(() => {
    import('@periodic-table').then(({ PeriodicTable: PT }) => {
      const pt = PT.load();
      const elements = pt.all() as WasmElement[];
      setCtx({ pt, elements });
    });
  }, []);

  if (!ctx) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-accent text-lg">
        Loading elements…
      </div>
    );
  }

  return <WasmContext.Provider value={ctx}>{children}</WasmContext.Provider>;
}

export function WasmProvider({ children }: { children: ReactNode }) {
  return (
    <WasmErrorBoundary>
      <WasmLoader>{children}</WasmLoader>
    </WasmErrorBoundary>
  );
}
