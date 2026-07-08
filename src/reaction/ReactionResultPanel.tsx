// src/reaction/ReactionResultPanel.tsx
import type { WasmReactionResult, WasmTerm, WasmRedox, WasmElementRedox } from '@periodic-table';

const coef = (n: number, s: string) => (n === 1 ? s : `${n}${s}`);
const sign = (n: number) => (n > 0 ? `+${n}` : n === 0 ? '0' : `${n}`);
const equation = (ts: WasmTerm[]) => ts.map(t => coef(t.coeff, t.formula)).join(' + ');

function RedoxBlock({ redox }: { redox: WasmRedox }) {
  if (!redox.is_redox) {
    return <div className="text-xs text-muted border-t border-muted/30 pt-2">{redox.narrative[0] ?? 'Not a redox reaction.'}</div>;
  }
  return (
    <div className="flex flex-col gap-1 border-t border-muted/30 pt-2">
      <div className="text-xs text-accent font-semibold">Redox</div>
      {redox.oxidising_agent && <div className="text-xs text-white">Oxidising agent: {redox.oxidising_agent}</div>}
      {redox.reducing_agent && <div className="text-xs text-white">Reducing agent: {redox.reducing_agent}</div>}
      {redox.changes.map((c: WasmElementRedox) => (
        <div key={`${c.symbol}-${c.reactant_formula}-${c.product_formula}`} className="text-xs text-muted">
          {c.symbol}: {sign(c.before)} → {sign(c.after)} ({c.change})
        </div>
      ))}
      {redox.narrative.map((line: string) => <div key={line} className="text-[11px] text-white/70">{line}</div>)}
    </div>
  );
}

export function ReactionResultPanel({ result, showQuantities }: { result: WasmReactionResult; showQuantities: boolean }) {
  if (!result.feasible) {
    return (
      <div className="flex flex-col gap-1 rounded-lg bg-surface p-3">
        {result.error && <div className="text-sm text-anion">{result.error}</div>}
        {result.messages.map((m: string) => <div key={m} className="text-xs text-amber-400">{m}</div>)}
        {!result.error && result.messages.length === 0 && <div className="text-xs text-muted">No reaction.</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface p-3">
      <div className="text-center text-lg text-white">
        {equation(result.reactants)} → {equation(result.products)}
      </div>
      <div>
        <span className="rounded-full px-2 py-0.5 text-xs text-bg bg-accent">{result.reaction_class}</span>
      </div>

      {showQuantities && (
        <>
          {result.products.map((p: WasmTerm, i: number) => {
            const y = result.yields[i];
            if (!y) return null;
            return (
              <div key={p.formula} className="flex items-center gap-2 py-0.5 text-sm">
                <span className="flex-1 text-white">{p.formula}</span>
                <span className="font-bold text-white">{y[0].toFixed(2)} mol</span>
                <span className="text-muted">{y[1].toFixed(2)} g</span>
              </div>
            );
          })}
          {result.limiting !== 'Both' && <div className="text-xs text-muted">Limiting: reactant {result.limiting}</div>}
          {result.excess[0] > 0 && (
            <div className="text-xs text-muted">Excess: {result.excess[0].toFixed(2)} mol ({result.excess[1].toFixed(2)} g)</div>
          )}
        </>
      )}

      {result.messages.map((m: string) => <div key={m} className="text-xs text-amber-400">{m}</div>)}
      {result.redox && <RedoxBlock redox={result.redox} />}
    </div>
  );
}
