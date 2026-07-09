import { useState } from 'react';
import { WasmProvider } from './wasm/WasmProvider';
import { IonicCanvasProvider } from './canvas/IonicCanvasProvider';
import { IonicCanvas } from './canvas/IonicCanvas';
import { ReactionView } from './reaction/ReactionView';

type Mode = 'build' | 'react';

export default function App() {
  const [mode, setMode] = useState<Mode>('build');
  return (
    <WasmProvider>
      <IonicCanvasProvider>
        <div className="flex flex-col h-screen">
          <div className="flex gap-2 p-2 shrink-0 border-b border-muted/30">
            {(['build', 'react'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  mode === m ? 'border-accent bg-accent/20 text-accent' : 'border-muted/40 text-muted'
                }`}
              >
                {m === 'build' ? 'Build' : 'React'}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0">
            {mode === 'build' ? <IonicCanvas /> : <ReactionView />}
          </div>
        </div>
      </IonicCanvasProvider>
    </WasmProvider>
  );
}
