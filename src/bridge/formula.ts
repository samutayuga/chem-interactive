import { gcd } from '../utils/gcd';
import type { ZoneState } from '../canvas/types';
import type { WasmReaction } from '@periodic-table';

export const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
export const toSub = (n: number) => String(n).split('').map(d => SUBSCRIPTS[+d]).join('');
export const fmt = (sym: string, n: number) => (n > 1 ? `${sym}${toSub(n)}` : sym);

/** Product subscripts (for the balanced equation) and a display formula string. */
export function productInfo(
  reaction: WasmReaction | undefined, slotA: ZoneState, slotB: ZoneState,
): { subA: number; subB: number; formula: string } {
  if (reaction?.bonding === 'Covalent' && reaction.covalent) {
    const { n_a, n_b } = reaction.covalent;
    return { subA: n_a, subB: n_b, formula: fmt(slotA.symbol, n_a) + fmt(slotB.symbol, n_b) };
  }
  if (reaction?.bonding === 'Ionic') {
    const ca = Math.abs(slotA.derivedCharge ?? slotA.oxidationStates[0] ?? 1);
    const cb = Math.abs(slotB.derivedCharge ?? slotB.oxidationStates[0] ?? 1);
    const g = gcd(ca, cb) || 1;
    const subA = cb / g, subB = ca / g;
    const aPart = slotA.isPolyatomic && subA > 1 ? `(${slotA.symbol})${toSub(subA)}` : fmt(slotA.symbol, subA);
    const bPart = slotB.isPolyatomic && subB > 1 ? `(${slotB.symbol})${toSub(subB)}` : fmt(slotB.symbol, subB);
    return { subA, subB, formula: aPart + bPart };
  }
  const formula = slotA.symbol === slotB.symbol ? slotA.symbol : `${slotA.symbol}·${slotB.symbol}`;
  return { subA: 1, subB: 1, formula };
}
