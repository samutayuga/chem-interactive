import type { ZoneState } from '../canvas/types';
import type { PeriodicTable } from '@periodic-table';
import { classifyReaction } from '../wasm/chem';
import { productInfo } from '../bridge/formula';

/**
 * Formula string for a bin holding exactly 2 species, e.g. "NaCl" / "MgCl₂".
 * Returns null for 0–1 species, or while a transition-metal charge is still
 * unresolved (bin stays in chip mode + TM picker until the user picks one).
 */
export function binCompound(pt: PeriodicTable, species: ZoneState[]): string | null {
  if (species.length !== 2) return null;
  const unresolvedTM = species.some(s => s.isTransition && s.derivedCharge === null);
  if (unresolvedTM) return null;
  const reaction = classifyReaction(pt, species[0].symbol, species[1].symbol);
  return productInfo(reaction, species[0], species[1]).formula;
}
