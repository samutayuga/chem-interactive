import { describe, it, expect } from 'vitest';
import { gcd } from '../utils/gcd';

describe('gcd', () => {
  it('returns 1 for coprime numbers', () => expect(gcd(2, 3)).toBe(1));
  it('returns 2 for Ca2O2', () => expect(gcd(2, 2)).toBe(2));
  it('returns 1 for Fe2O3', () => expect(gcd(2, 3)).toBe(1));
  it('handles gcd(1, n)', () => expect(gcd(1, 4)).toBe(1));
  it('handles gcd(n, 1)', () => expect(gcd(4, 1)).toBe(1));
});
