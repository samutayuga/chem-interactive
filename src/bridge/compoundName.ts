import type { ZoneState } from '../canvas/types';
import { gcd } from '../utils/gcd';

// Port of iOS CompoundName.swift — IUPAC names for the bridge result.

const ANION_ROOTS: Record<string, string> = {
  F: 'Fluoride', Cl: 'Chloride', Br: 'Bromide', I: 'Iodide',
  O: 'Oxide', S: 'Sulfide', Se: 'Selenide', Te: 'Telluride',
  N: 'Nitride', P: 'Phosphide', As: 'Arsenide',
  C: 'Carbide', H: 'Hydride',
};

const GREEK = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca'];
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/** Resolve an element symbol to its full name (e.g. "Fe" → "Iron"). */
export type NameOf = (symbol: string) => string;

function roman(n: number): string {
  return n >= 1 && n < ROMAN.length ? ROMAN[n] : String(n);
}

function anionRoot(symbol: string, nameOf: NameOf): string {
  return ANION_ROOTS[symbol] ?? nameOf(symbol);
}

/** Greek prefix for a count. `allowMono` adds "mono" for count 1 (second element only). */
function greekPrefix(count: number, allowMono: boolean): string {
  if (count === 1) return allowMono ? 'mono' : '';
  return count >= 0 && count < GREEK.length ? GREEK[count] : '';
}

/** Join a Greek prefix to a root, eliding the prefix's trailing a/o before a vowel. */
function joinElided(prefix: string, root: string): string {
  const first = root.toLowerCase()[0];
  const last = prefix[prefix.length - 1];
  if (first && 'aeiou'.includes(first) && (last === 'a' || last === 'o')) {
    return prefix.slice(0, -1) + root;
  }
  return prefix + root;
}

function sentenceCased(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function ionicCompoundName(
  cation: ZoneState, anion: ZoneState, nameOf: NameOf, ionNameOf: NameOf,
): string {
  let cationWord: string;
  if (cation.isPolyatomic) {
    cationWord = ionNameOf(cation.symbol);
  } else {
    cationWord = nameOf(cation.symbol);
    const variable = cation.isTransition || cation.oxidationStates.length > 1;
    if (variable && cation.derivedCharge !== null && cation.derivedCharge > 0) {
      cationWord += `(${roman(cation.derivedCharge)})`;
    }
  }
  const anionWord = anion.isPolyatomic ? ionNameOf(anion.symbol) : anionRoot(anion.symbol, nameOf);
  return `${cationWord} ${anionWord.toLowerCase()}`;
}

// --- covalent stoichiometry (mirrors CovalentView / iOS CovalentStoich) ---

function shellTarget(ve: number) { return ve <= 2 ? 2 : 8; }
function bondsNeeded(ve: number) { return Math.max(0, shellTarget(ve) - ve); }

function calcStoich(veA: number, veB: number): { nA: number; nB: number } {
  const bA = bondsNeeded(veA), bB = bondsNeeded(veB);
  if (!bA || !bB) return { nA: 1, nB: 1 };
  const g = gcd(bA, bB);
  return { nA: bB / g, nB: bA / g };
}

function covalentStoich(a: ZoneState, b: ZoneState): { nA: number; nB: number } {
  const base = calcStoich(a.valenceElectrons, b.valenceElectrons);
  const mismatch = a.group === b.group && a.period !== b.period && base.nA === 1 && base.nB === 1
    && bondsNeeded(a.valenceElectrons) === 2;
  if (mismatch) {
    return a.period > b.period ? { nA: 1, nB: 2 } : { nA: 2, nB: 1 };
  }
  return base;
}

const IUPAC_ORDER: Record<string, number> = {
  B: 1, Si: 2, C: 3, Sb: 4, As: 5, P: 6, N: 7, H: 8,
  Te: 9, Se: 10, S: 11, O: 12, I: 13, Br: 14, Cl: 15, F: 16,
};

function iupacFirst(a: string, b: string): boolean {
  return (IUPAC_ORDER[a] ?? 0) <= (IUPAC_ORDER[b] ?? 0);
}

function covalentName(
  firstSymbol: string, firstCount: number,
  secondSymbol: string, secondCount: number, nameOf: NameOf,
): string {
  const firstWord = greekPrefix(firstCount, false) + nameOf(firstSymbol).toLowerCase();
  const secondWord = joinElided(greekPrefix(secondCount, true), anionRoot(secondSymbol, nameOf).toLowerCase());
  return sentenceCased(`${firstWord} ${secondWord}`);
}

export function covalentCompoundName(slotA: ZoneState, slotB: ZoneState, nameOf: NameOf): string {
  if (slotA.symbol === slotB.symbol) return nameOf(slotA.symbol);
  const s = covalentStoich(slotA, slotB);
  const aFirst = iupacFirst(slotA.symbol, slotB.symbol);
  return covalentName(
    aFirst ? slotA.symbol : slotB.symbol,
    aFirst ? s.nA : s.nB,
    aFirst ? slotB.symbol : slotA.symbol,
    aFirst ? s.nB : s.nA,
    nameOf,
  );
}
