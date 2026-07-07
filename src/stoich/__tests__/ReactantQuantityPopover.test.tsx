import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactantQuantityPopover } from '../ReactantQuantityPopover';

describe('ReactantQuantityPopover', () => {
  it('emits entry when valid number typed', () => {
    const onChange = vi.fn();
    render(<ReactantQuantityPopover symbol="H" entry={null} onChange={onChange} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2' } });
    expect(onChange).toHaveBeenLastCalledWith({ value: 2, unit: 'mole' });
  });

  it('emits null when cleared', () => {
    const onChange = vi.fn();
    render(<ReactantQuantityPopover symbol="H" entry={{ value: 2, unit: 'mole' }} onChange={onChange} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('switches unit to mass and re-emits', () => {
    const onChange = vi.fn();
    render(<ReactantQuantityPopover symbol="O" entry={{ value: 32, unit: 'mole' }} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'g' }));
    expect(onChange).toHaveBeenLastCalledWith({ value: 32, unit: 'mass' });
  });
});
