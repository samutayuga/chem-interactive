import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PotionFlask } from '../PotionFlask';

describe('PotionFlask', () => {
  it('exposes the state via data attribute', () => {
    const { container } = render(<PotionFlask state="Liquid" fill={0.6} label="H₂O" />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('data-state')).toBe('Liquid');
  });

  it('renders the label text', () => {
    const { getByText } = render(<PotionFlask state="Solid" fill={0.5} label="Fe" />);
    expect(getByText('Fe')).toBeInTheDocument();
  });

  it('clamps fill out of range without throwing', () => {
    const { container } = render(<PotionFlask state="Gas" fill={5} />);
    expect(container.querySelector('svg[data-state="Gas"]')).toBeTruthy();
  });
});
