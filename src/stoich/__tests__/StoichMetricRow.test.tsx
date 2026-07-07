import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoichMetricRow } from '../StoichMetricRow';

describe('StoichMetricRow', () => {
  it('renders title, moles and mass to 2 decimals', () => {
    render(<StoichMetricRow icon="⚛" title="Yield" moles={2} mass={18.015} />);
    expect(screen.getByText('Yield')).toBeInTheDocument();
    expect(screen.getByText('2.00 mol')).toBeInTheDocument();
    expect(screen.getByText('18.02 g')).toBeInTheDocument();
  });
});
