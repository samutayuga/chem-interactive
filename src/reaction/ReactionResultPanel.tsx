// src/reaction/ReactionResultPanel.tsx
import type { WasmReactionResult, WasmTerm, WasmRedox, WasmElementRedox } from '@periodic-table';
import type { Diagnosis } from './diagnose';

const coef = (n: number, s: string) => (n === 1 ? s : `${n}${s}`);
const sign = (n: number) => (n > 0 ? `+${n}` : n === 0 ? '0' : `${n}`);
const equation = (ts: WasmTerm[]) => ts.map(t => coef(t.coeff, t.formula)).join(' + ');

function RedoxBlock({ redox }: { redox: WasmRedox }) {
  if (!redox.is_redox) {
    return <div className="text-xs text-white/70 border-t border-muted/30 pt-2">{redox.narrative[0] ?? 'Not a redox reaction.'}</div>;
  }
  return (
    <div className="flex flex-col gap-1 border-t border-muted/30 pt-2">
      <div className="text-xs text-accent font-semibold">Redox</div>
      {redox.oxidising_agent && <div className="text-xs text-white">Oxidising agent: {redox.oxidising_agent}</div>}
      {redox.reducing_agent && <div className="text-xs text-white">Reducing agent: {redox.reducing_agent}</div>}
      {redox.changes.map((c: WasmElementRedox) => (
        <div key={`${c.symbol}-${c.reactant_formula}-${c.product_formula}`} className="text-xs text-white/75">
          {c.symbol}: {sign(c.before)} → {sign(c.after)} ({c.change})
        </div>
      ))}
      {redox.narrative.map((line: string) => <div key={line} className="text-[11px] text-white/70">{line}</div>)}
    </div>
  );
}

function DiagnosisCard({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-surface p-3 border border-anion/50 max-w-md mx-auto w-full text-center">
      <div className="text-sm font-semibold text-anion">{diagnosis.reason}</div>
      {diagnosis.hint && <div className="text-xs text-white/75">{diagnosis.hint}</div>}
      {diagnosis.suggestions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-xs text-white/60">Try:</span>
          {diagnosis.suggestions.map(sug => (
            <span
              key={sug.symbol}
              title={sug.note}
              className="rounded-full px-2 py-0.5 text-xs font-medium text-bg bg-accent"
            >{sug.symbol}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReactionResultPanel(
  { result, showQuantities, diagnosis }:
  { result: WasmReactionResult; showQuantities: boolean; diagnosis?: Diagnosis | null },
) {
  // A diagnosis blocks the (implausible or failed) reaction: show guidance instead.
  if (diagnosis) return <DiagnosisCard diagnosis={diagnosis} />;

  if (!result.feasible) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-lg bg-surface p-3 max-w-md mx-auto w-full text-center">
        {result.error && <div className="text-sm text-anion">{result.error}</div>}
        {result.messages.map((m: string) => <div key={m} className="text-xs text-amber-400 text-center">{m}</div>)}
        {!result.error && result.messages.length === 0 && <div className="text-xs text-white/70">No reaction.</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface p-3 max-w-md mx-auto w-full">
      <div className="text-center text-lg text-white">
        {equation(result.reactants)} → {equation(result.products)}
      </div>
      <div className="flex justify-center">
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
                <span className="text-white/70">{y[1].toFixed(2)} g</span>
              </div>
            );
          })}
          {result.limiting !== 'Both' && <div className="text-xs text-white/70">Limiting: reactant {result.limiting}</div>}
          {result.excess[0] > 0 && (
            <div className="text-xs text-white/70">Excess: {result.excess[0].toFixed(2)} mol ({result.excess[1].toFixed(2)} g)</div>
          )}
        </>
      )}

      {result.messages.map((m: string) => <div key={m} className="text-xs text-amber-400 text-center">{m}</div>)}
      {result.redox && <RedoxBlock redox={result.redox} />}
    </div>
  );
}
