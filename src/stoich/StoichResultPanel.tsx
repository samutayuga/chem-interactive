import type { WasmStoichResult } from '@periodic-table';
import { StoichMetricRow } from './StoichMetricRow';

interface Props {
  symbolA: string;
  symbolB: string;
  productFormula: string;
  result: WasmStoichResult;
}

const coef = (n: number, s: string) => (n === 1 ? s : `${n}${s}`);

export function StoichResultPanel({ symbolA, symbolB, productFormula, result }: Props) {
  const limitingLabel =
    result.limiting === 'Both' ? 'Stoichiometric'
    : result.limiting === 'A' ? symbolA
    : symbolB;

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface p-3">
      <div className="text-center text-lg text-white">
        {coef(result.coeff_a, symbolA)} + {coef(result.coeff_b, symbolB)} → {coef(result.coeff_product, productFormula)}
      </div>
      <div className="text-xs text-muted">Limiting: {limitingLabel}</div>
      <StoichMetricRow icon="⚛" title="Yield" moles={result.yield_moles} mass={result.yield_mass} />
      {result.excess_moles > 0 && (
        <StoichMetricRow icon="🧪" title="Excess" moles={result.excess_moles} mass={result.excess_mass} />
      )}
      {result.diatomic_messages.map((m: string) => (
        <div key={m} className="text-xs text-amber-400">{m}</div>
      ))}
    </div>
  );
}
