export function groupToValenceFallback(group: number): number {
  if (group <= 2) return group;
  if (group >= 13) return group - 10;
  return 0;
}

export function isTransitionMetal(group: number): boolean {
  return group >= 3 && group <= 12;
}

export function parseValenceElectrons(config: string, group: number): number {
  // Strip noble gas prefix e.g. "[Ne] 3s2" → "3s2"
  const stripped = config.replace(/\[[A-Z][a-z]?\]\s*/, '').trim();
  if (!stripped) return groupToValenceFallback(group);

  // Parse subshell tokens e.g. "3s2" → { n: 3, count: 2 }
  const tokens = stripped.split(/\s+/);
  const subshells = tokens
    .map(t => {
      const m = t.match(/^(\d)[spdf](\d+)$/);
      return m ? { n: parseInt(m[1], 10), count: parseInt(m[2], 10) } : null;
    })
    .filter((x): x is { n: number; count: number } => x !== null);

  if (subshells.length === 0) return groupToValenceFallback(group);

  const maxN = Math.max(...subshells.map(s => s.n));
  return subshells
    .filter(s => s.n === maxN)
    .reduce((sum, s) => sum + s.count, 0);
}
