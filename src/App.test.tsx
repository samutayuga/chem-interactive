// src/App.test.tsx
import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

it('defaults to Build mode and toggles to React mode', async () => {
  const u = userEvent.setup();
  render(<App />);
  // both tab buttons exist (wait for wasm to finish loading first)
  expect(await screen.findByRole('button', { name: 'Build' })).toBeInTheDocument();
  const react = screen.getByRole('button', { name: 'React' });
  await u.click(react);
  // React mode shows the two reactant bins
  expect(await screen.findByText(/Reactant A/)).toBeInTheDocument();
  expect(screen.getByText(/Reactant B/)).toBeInTheDocument();
}, 30000);
