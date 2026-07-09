import { describe, it, expect, beforeAll } from 'vitest';
import { PeriodicTable, solve_compound_reaction } from '@periodic-table';
import type { WasmSpecies, WasmReactionResult } from '@periodic-table';
import type { ZoneState } from '../canvas/types';
import { diagnoseReaction } from './diagnose';

let pt: PeriodicTable;
beforeAll(() => { pt = PeriodicTable.load(); });

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

const solve = (a: ZoneState[], b: ZoneState[]) =>
  solve_compound_reaction(
    a.map(s => ({ symbol: s.symbol, is_polyatomic: s.isPolyatomic, charge: s.derivedCharge ?? undefined }) as WasmSpecies),
    b.map(s => ({ symbol: s.symbol, is_polyatomic: s.isPolyatomic, charge: s.derivedCharge ?? undefined }) as WasmSpecies),
  );

describe('diagnoseReaction', () => {
  it('returns null for a plausible feasible reaction (Na + Cl)', () => {
    const A = [z('Na')], B = [z('Cl')];
    expect(diagnoseReaction(pt, A, B, solve(A, B))).toBeNull();
  });

  it('blocks a noble gas and suggests partners for the keeper (O + Ne)', () => {
    const A = [z('O')], B = [z('Ne')];
    const d = diagnoseReaction(pt, A, B, solve(A, B))!;
    expect(d).not.toBeNull();
    expect(d.reason).toMatch(/Ne is a noble gas/);
    // O is a non-metal → suggest metals
    expect(d.suggestions.map(s => s.symbol)).toContain('Na');
    expect(d.suggestions.map(s => s.symbol)).not.toContain('Ne');
  });

  it('translates a same-element balance failure (O + O)', () => {
    const A = [z('O')], B = [z('O')];
    const r = solve(A, B);
    expect(r.feasible).toBe(false);
    const d = diagnoseReaction(pt, A, B, r)!;
    expect(d.reason).toMatch(/same element/);
    expect(d.reason).toMatch(/pair O/);
    expect(d.suggestions.map(s => s.symbol)).toContain('Na');
  });

  it('suggests non-metals for a metal keeper (Na + Ar)', () => {
    const A = [z('Na', { elementClass: 'Metal' })], B = [z('Ar')];
    const d = diagnoseReaction(pt, A, B, solve(A, B))!;
    expect(d.reason).toMatch(/Ar is a noble gas/);
    expect(d.suggestions.map(s => s.symbol)).toEqual(expect.arrayContaining(['O', 'Cl']));
  });

  it('gives a generic starter when both bins are noble gases (Ne + Ar)', () => {
    const A = [z('Ne')], B = [z('Ar')];
    const d = diagnoseReaction(pt, A, B, solve(A, B))!;
    expect(d.suggestions.map(s => s.symbol)).toEqual(['Na', 'Cl']);
    expect(d.hint).toMatch(/metal \+ a non-metal/);
  });

  it('asks for a charge on an unresolved transition metal (Fe + Cl)', () => {
    const A = [z('Fe', { isTransition: true })], B = [z('Cl')];
    const r = solve(A, B);
    expect(r.feasible).toBe(false);
    const d = diagnoseReaction(pt, A, B, r)!;
    expect(d.reason).toMatch(/Pick a charge for Fe/);
    expect(d.suggestions).toEqual([]);
  });

  const fakeResult = (over: Partial<WasmReactionResult>): WasmReactionResult => ({
    feasible: false, reaction_class: 'None', reactants: [], products: [],
    limiting: 'Both', yields: [], excess: [0, 0], messages: [], error: undefined,
    redox: undefined, ...over,
  });

  it('surfaces an unrecognised engine error verbatim with no suggestions', () => {
    const A = [z('Na', { elementClass: 'Metal' })], B = [z('Cl')];
    const d = diagnoseReaction(pt, A, B, fakeResult({ error: 'kaboom' }))!;
    expect(d).toEqual({ reason: 'kaboom', suggestions: [] });
  });

  it('returns null for an infeasible result with no error message', () => {
    const A = [z('Na', { elementClass: 'Metal' })], B = [z('Cl')];
    expect(diagnoseReaction(pt, A, B, fakeResult({}))).toBeNull();
  });
});
