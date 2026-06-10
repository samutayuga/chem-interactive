import { describe, it, expect } from 'vitest';
import { parseValenceElectrons, isTransitionMetal, groupToValenceFallback } from '../utils/valence';

describe('parseValenceElectrons', () => {
  it('parses Mg: 1s2 2s2 2p6 3s2 → 2', () =>
    expect(parseValenceElectrons('1s2 2s2 2p6 3s2', 2)).toBe(2));
  it('parses O: 1s2 2s2 2p4 → 6', () =>
    expect(parseValenceElectrons('1s2 2s2 2p4', 16)).toBe(6));
  it('parses Cl with noble gas: [Ne] 3s2 3p5 → 7', () =>
    expect(parseValenceElectrons('[Ne] 3s2 3p5', 17)).toBe(7));
  it('parses Na: [Ne] 3s1 → 1', () =>
    expect(parseValenceElectrons('[Ne] 3s1', 1)).toBe(1));
  it('falls back to group heuristic on bad input', () =>
    expect(parseValenceElectrons('', 2)).toBe(2));
});

describe('isTransitionMetal', () => {
  it('Fe group 8 → true', () => expect(isTransitionMetal(8)).toBe(true));
  it('Mg group 2 → false', () => expect(isTransitionMetal(2)).toBe(false));
  it('Cl group 17 → false', () => expect(isTransitionMetal(17)).toBe(false));
  it('group 3 → true', () => expect(isTransitionMetal(3)).toBe(true));
  it('group 12 → true', () => expect(isTransitionMetal(12)).toBe(true));
});

describe('groupToValenceFallback', () => {
  it('group 1 → 1', () => expect(groupToValenceFallback(1)).toBe(1));
  it('group 2 → 2', () => expect(groupToValenceFallback(2)).toBe(2));
  it('group 13 → 3', () => expect(groupToValenceFallback(13)).toBe(3));
  it('group 16 → 6', () => expect(groupToValenceFallback(16)).toBe(6));
  it('group 17 → 7', () => expect(groupToValenceFallback(17)).toBe(7));
});
