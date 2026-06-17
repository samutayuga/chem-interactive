import { WasmProvider } from './wasm/WasmProvider';
import { IonicCanvasProvider } from './canvas/IonicCanvasProvider';
import { IonicCanvas } from './canvas/IonicCanvas';

export default function App() {
  return (
    <WasmProvider>
      <IonicCanvasProvider>
        <IonicCanvas />
      </IonicCanvasProvider>
    </WasmProvider>
  );
}
