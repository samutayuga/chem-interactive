import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductStateBadge } from '../ProductStateBadge';

describe('ProductStateBadge', () => {
  it('renders the product state label', () => {
    render(<ProductStateBadge state="Liquid" />);
    expect(screen.getByText('Liquid')).toBeInTheDocument();
  });

  it('renders solid and gas labels', () => {
    const { rerender } = render(<ProductStateBadge state="Solid" />);
    expect(screen.getByText('Solid')).toBeInTheDocument();
    rerender(<ProductStateBadge state="Gas" />);
    expect(screen.getByText('Gas')).toBeInTheDocument();
  });
});
