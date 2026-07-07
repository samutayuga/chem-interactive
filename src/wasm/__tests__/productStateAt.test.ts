import { describe, it, expect, beforeAll } from 'vitest';
import { PeriodicTable } from '@periodic-table';
import { productStateAt } from '../chem';

let pt: PeriodicTable;
beforeAll(() => { pt = PeriodicTable.load(); });

describe('productStateAt', () => {
  it('returns Liquid for Fe at 1900 K (above melting, below boiling)', () => {
    // Iron melts ~1811 K, boils ~3134 K → 1900 K is liquid
    expect(productStateAt(pt, 'Fe', 1900)).toBe('Liquid');
  });

  it('returns Solid for Fe at room temperature', () => {
    expect(productStateAt(pt, 'Fe', 300)).toBe('Solid');
  });
});
