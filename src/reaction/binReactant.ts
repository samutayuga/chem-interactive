import type { ZoneState } from '../canvas/types';
import type { PeriodicTable } from '@periodic-table';
import { binResolve } from './binFormula';

export type MassKind = 'Ar' | 'Mr';

/** A resolved bin reactant with its relative mass, mirroring iOS ReactantZoneView. */
export interface BinReactant {
  formula: string;
  /** Relative formula mass — numerically the molar mass in g/mol. */
  molarMass: number;
  /** 'Ar' for a lone atom, 'Mr' for a molecule / compound / polyatomic ion. */
  massKind: MassKind;
}

const SUBS = '₀₁₂₃₄₅₆₇₈₉';

/**
 * Element→atom-count for a bare element or polyatomic-ion symbol, e.g.
 * "Na" → {Na:1}, "SO₄" → {S:1, O:4}, "NH₄" → {N:1, H:4}. Subscripts are the
 * unicode glyphs the app renders (₀–₉); a missing subscript counts as 1.
 */
export function parseFormula(symbol: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of symbol.matchAll(/([A-Z][a-z]?)([₀-₉]*)/g)) {
    const el = m[1];
    if (!el) continue;
    const n = m[2] ? [...m[2]].reduce((acc, ch) => acc * 10 + SUBS.indexOf(ch), 0) : 1;
    counts[el] = (counts[el] ?? 0) + n;
  }
  return counts;
}

const atomicMass = (pt: PeriodicTable, sym: string): number | undefined => {
  const el = pt.by_symbol?.(sym);
  return el?.computed_atomic_mass ?? el?.atomic_mass ?? undefined;
};

/** Sum atomic masses over an element→count map; null if any element is unknown. */
function molarMassOf(pt: PeriodicTable, comp: Record<string, number>): number | null {
  let total = 0;
  for (const [el, n] of Object.entries(comp)) {
    const m = atomicMass(pt, el);
    if (m === undefined) return null;
    total += m * n;
  }
  return total;
}

const massKindOf = (comp: Record<string, number>): MassKind => {
  const distinct = Object.keys(comp).length;
  const total = Object.values(comp).reduce((a, b) => a + b, 0);
  return distinct === 1 && total === 1 ? 'Ar' : 'Mr';
};

/**
 * Relative mass (Ar/Mr) for a reactant bin, following the iOS ReactantZoneView
 * rule: a lone atom reports Ar (relative atomic mass); anything else reports Mr
 * (relative formula mass). Returns null for an empty bin, an over-full bin, or
 * while a 2-species transition-metal charge is still unresolved.
 */
export function binReactant(pt: PeriodicTable, species: ZoneState[]): BinReactant | null {
  if (species.length === 1) {
    const comp = parseFormula(species[0].symbol);
    const molarMass = molarMassOf(pt, comp);
    if (molarMass === null) return null;
    return { formula: species[0].symbol, molarMass, massKind: massKindOf(comp) };
  }
  const resolved = binResolve(pt, species);
  if (!resolved) return null;
  const comp: Record<string, number> = {};
  for (const slot of resolved.slots) {
    for (const [el, n] of Object.entries(parseFormula(slot.symbol))) {
      comp[el] = (comp[el] ?? 0) + n * slot.sub;
    }
  }
  const molarMass = molarMassOf(pt, comp);
  if (molarMass === null) return null;
  return { formula: resolved.formula, molarMass, massKind: massKindOf(comp) };
}
