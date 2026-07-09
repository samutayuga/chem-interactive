import type { ZoneState } from '../canvas/types';
import type { PeriodicTable, WasmReaction } from '@periodic-table';
import { classifyReaction } from '../wasm/chem';
import { productInfo } from '../bridge/formula';

const IONIC: WasmReaction = {
  bonding: 'Ionic', glyph: '', product_state: '', covalent: undefined, metallic_electrons: undefined,
};

const effCharge = (s: ZoneState) => s.derivedCharge ?? s.oxidationStates[0] ?? 0;

// Electronegativity of a bare element, or undefined for polyatomic ions (which
// have no single EN) or when the wasm lookup is unavailable (mocked tests).
const enOf = (pt: PeriodicTable, s: ZoneState): number | undefined =>
  s.isPolyatomic ? undefined : (pt.by_symbol?.(s.symbol)?.electronegativity ?? undefined);

/** One ordered slot of a resolved 2-species compound. */
export interface BinSlot { symbol: string; isPolyatomic: boolean; sub: number }

/** A resolved 2-species compound: display formula plus its ordered slots. */
export interface BinResolved { formula: string; slots: [BinSlot, BinSlot] }

/**
 * Resolve a bin holding exactly 2 species into its display formula and the two
 * ordered slots (with subscripts), e.g. "MgCl₂" → [{Mg,1},{Cl,2}]. Returns null
 * for 0–1 species, or while a transition-metal charge is still unresolved (bin
 * stays in chip mode + TM picker until the user picks one).
 */
export function binResolve(pt: PeriodicTable, species: ZoneState[]): BinResolved | null {
  if (species.length !== 2) return null;
  const unresolvedTM = species.some(s => s.isTransition && s.derivedCharge === null);
  if (unresolvedTM) return null;
  // productInfo trusts slotA / slotB order and only parenthesises + subscripts
  // slotB, so we must hand it the element that leads the written formula first.
  // The universal rule for a binary compound is: the LESS electronegative
  // element is written first (metal cation in ionic, e.g. Na in NaCl; and the
  // more electropositive atom in covalent, e.g. C in CO₂ — not "O₂C"). Ordering
  // by raw oxidation-state charge fails here because carbon's first listed
  // oxidation state is −4, which wrongly ranks it as the anion.
  const enA = enOf(pt, species[0]);
  const enB = enOf(pt, species[1]);
  const [cation, anion] =
    enA !== undefined && enB !== undefined && enA !== enB
      // less electronegative element leads the formula
      ? (enA < enB ? [species[0], species[1]] : [species[1], species[0]])
      // fallback (polyatomic ions / missing EN): more positive charge leads,
      // so a reversed click (e.g. OH then Ca) still yields "Ca(OH)₂", not "OH₂Ca".
      : (effCharge(species[0]) >= effCharge(species[1])
          ? [species[0], species[1]]
          : [species[1], species[0]]);
  // pt.react only resolves bare elemental symbols; polyatomic ions (e.g.
  // "OH") always form ionic compounds, so short-circuit before hitting the
  // wasm classifier (mirrors the DROP_ELEMENT guard in canvas/reducer.ts).
  const reaction = cation.isPolyatomic || anion.isPolyatomic
    ? IONIC
    : classifyReaction(pt, cation.symbol, anion.symbol);
  const { subA, subB, formula } = productInfo(reaction, cation, anion);
  return {
    formula,
    slots: [
      { symbol: cation.symbol, isPolyatomic: cation.isPolyatomic, sub: subA },
      { symbol: anion.symbol, isPolyatomic: anion.isPolyatomic, sub: subB },
    ],
  };
}

/**
 * Formula string for a bin holding exactly 2 species, e.g. "NaCl" / "MgCl₂".
 * Returns null for 0–1 species or an unresolved transition-metal charge.
 */
export function binCompound(pt: PeriodicTable, species: ZoneState[]): string | null {
  return binResolve(pt, species)?.formula ?? null;
}
