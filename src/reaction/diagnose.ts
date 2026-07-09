import type { ZoneState } from '../canvas/types';
import type { PeriodicTable, WasmReactionResult } from '@periodic-table';

export interface Suggestion { symbol: string; note?: string }
export interface Diagnosis { reason: string; hint?: string; suggestions: Suggestion[] }

const METAL_CATEGORIES = new Set([
  'AlkaliMetal', 'AlkalineEarthMetal', 'TransitionMetal', 'PostTransitionMetal',
]);
const NONMETAL_CATEGORIES = new Set(['ReactiveNonmetal', 'Halogen', 'Metalloid']);

const categoryOf = (pt: PeriodicTable, sym: string): string | undefined =>
  pt.by_symbol?.(sym)?.category;

/** First bare (non-polyatomic) element in a bin, or undefined. */
const firstElement = (species: ZoneState[]): ZoneState | undefined =>
  species.find(s => !s.isPolyatomic);

/** Curated, chemically-sound partner suggestions for a kept element. */
function suggestionsFor(pt: PeriodicTable, keeper: string | undefined): { suggestions: Suggestion[]; hint?: string } {
  const cat = keeper ? categoryOf(pt, keeper) : undefined;
  const take = (syms: string[], note?: string): Suggestion[] =>
    syms.filter(s => s !== keeper).slice(0, 5).map(symbol => ({ symbol, note }));

  if (cat && METAL_CATEGORIES.has(cat)) {
    return { suggestions: take(['O', 'Cl', 'S', 'F', 'N']), hint: `${keeper} is a metal — pair it with a non-metal to form an oxide or salt.` };
  }
  if (cat && NONMETAL_CATEGORIES.has(cat)) {
    return { suggestions: take(['Na', 'Mg', 'Ca', 'Al', 'Fe']), hint: `${keeper} is a non-metal — pair it with a metal to form a compound.` };
  }
  // No usable keeper (both noble / empty): generic starter pair.
  return { suggestions: [{ symbol: 'Na' }, { symbol: 'Cl' }], hint: 'Try a metal + a non-metal, e.g. Na + Cl.' };
}

/**
 * Diagnose why a reactant pair should not (or did not) react, and suggest better
 * partners. Returns null when the reaction is plausible and should be shown as-is.
 *
 * The compound engine is lenient (it accepts inert noble gases and only hard-fails
 * on same-element pairs), so this layer adds a noble-gas plausibility check and
 * translates the engine's cryptic failure strings into teaching feedback.
 */
export function diagnoseReaction(
  pt: PeriodicTable,
  speciesA: ZoneState[],
  speciesB: ZoneState[],
  result: WasmReactionResult,
): Diagnosis | null {
  const elemA = firstElement(speciesA);
  const elemB = firstElement(speciesB);

  // 1. Noble gas present → inert, block regardless of what the engine says.
  const nobleA = elemA && categoryOf(pt, elemA.symbol) === 'NobleGas' ? elemA : undefined;
  const nobleB = elemB && categoryOf(pt, elemB.symbol) === 'NobleGas' ? elemB : undefined;
  if (nobleA || nobleB) {
    const noble = (nobleA ?? nobleB)!;
    // keeper = a real (non-noble) element from the other bin, if any
    const keeper = [elemA, elemB].find(e => e && e !== noble && categoryOf(pt, e.symbol) !== 'NobleGas');
    const { suggestions, hint } = suggestionsFor(pt, keeper?.symbol);
    return { reason: `${noble.symbol} is a noble gas — inert, it won't react.`, hint, suggestions };
  }

  if (result.feasible) return null;

  const err = result.error ?? '';

  // 2. Same-element pair — the engine's only real balance failure.
  if (err.includes('could not be balanced')) {
    const sym = elemA?.symbol ?? elemB?.symbol ?? 'this element';
    const { suggestions, hint } = suggestionsFor(pt, sym);
    return {
      reason: `Two of the same element won't form a compound — pair ${sym} with a different element.`,
      hint,
      suggestions,
    };
  }

  // 3. Unresolved transition-metal charge — the TM picker handles the fix.
  if (err.includes('transition metal') && err.includes('charge')) {
    const sym = err.split(' ')[0];
    return { reason: `Pick a charge for ${sym} first — tap one of the charge options on its chip.`, suggestions: [] };
  }

  // 4. Any other engine error: surface it plainly, no suggestions.
  return err ? { reason: err, suggestions: [] } : null;
}
