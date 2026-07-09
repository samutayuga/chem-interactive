import type { ZoneState } from '../canvas/types';
import type { PeriodicTable, WasmReaction } from '@periodic-table';
import { classifyReaction } from '../wasm/chem';
import { productInfo } from '../bridge/formula';

const IONIC: WasmReaction = {
  bonding: 'Ionic', glyph: '', product_state: '', covalent: undefined, metallic_electrons: undefined,
};

/**
 * Formula string for a bin holding exactly 2 species, e.g. "NaCl" / "MgCl₂".
 * Returns null for 0–1 species, or while a transition-metal charge is still
 * unresolved (bin stays in chip mode + TM picker until the user picks one).
 */
const effCharge = (s: ZoneState) => s.derivedCharge ?? s.oxidationStates[0] ?? 0;

export function binCompound(pt: PeriodicTable, species: ZoneState[]): string | null {
  if (species.length !== 2) return null;
  const unresolvedTM = species.some(s => s.isTransition && s.derivedCharge === null);
  if (unresolvedTM) return null;
  // productInfo trusts slotA=cation / slotB=anion (it only parenthesises and
  // subscripts slotB), but species arrive in raw click order. Canonicalise so
  // the more positively charged species is the cation (slotA) — otherwise a
  // reversed click (e.g. OH then Ca) yields the malformed "OH₂Ca".
  const [cation, anion] = effCharge(species[0]) >= effCharge(species[1])
    ? [species[0], species[1]]
    : [species[1], species[0]];
  // pt.react only resolves bare elemental symbols; polyatomic ions (e.g.
  // "OH") always form ionic compounds, so short-circuit before hitting the
  // wasm classifier (mirrors the DROP_ELEMENT guard in canvas/reducer.ts).
  const reaction = cation.isPolyatomic || anion.isPolyatomic
    ? IONIC
    : classifyReaction(pt, cation.symbol, anion.symbol);
  return productInfo(reaction, cation, anion).formula;
}
