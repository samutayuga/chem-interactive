import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WasmProvider } from '../WasmProvider';

describe('WasmProvider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the loading fallback before wasm resolves', () => {
    render(
      <WasmProvider>
        <div>ready</div>
      </WasmProvider>,
    );
    // synchronously, the async import has not resolved yet → loading UI
    expect(screen.getByText(/Loading elements/)).toBeDefined();
  });

  it('renders children after the wasm core loads successfully', async () => {
    render(
      <WasmProvider>
        <div>ready</div>
      </WasmProvider>,
    );
    expect(await screen.findByText('ready')).toBeDefined();
  });

  it('renders the error UI when a child throws (error boundary path)', async () => {
    // silence the expected React error-boundary console noise
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Boom(): never {
      throw new Error('boom');
    }

    render(
      <WasmProvider>
        <Boom />
      </WasmProvider>,
    );

    // Boom only renders once the async wasm load resolves and children mount,
    // at which point getDerivedStateFromError + componentDidCatch fire and the
    // error UI is shown.
    expect(await screen.findByText('Failed to load element data')).toBeDefined();
    expect(screen.getByText('Please refresh the page.')).toBeDefined();
    expect(errSpy).toHaveBeenCalled();
  });
});
