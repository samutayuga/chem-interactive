import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Smoke test: render the real provider tree (WasmProvider + IonicCanvasProvider + IonicCanvas).
// NOTE: vi.mock of App's imported modules corrupts App.tsx's sourcemap under the istanbul
// provider (phantom duplicate function), so we mount the real tree instead of stubbing.
describe('App', () => {
  it('shows the loader, then mounts the provider tree and renders the canvas UI', async () => {
    render(<App />);
    // WasmProvider renders a loader until the wasm core resolves asynchronously.
    expect(screen.getByText('Loading elements…')).toBeInTheDocument();
    // ElementTray (rendered by IonicCanvas) exposes these tab controls once loaded.
    expect(await screen.findByText('Elements')).toBeInTheDocument();
    expect(screen.getByText('Polyatomic Ions')).toBeInTheDocument();
  });
});
