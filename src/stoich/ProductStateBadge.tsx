export type ProductState = 'Solid' | 'Liquid' | 'Gas';

const COLOR: Record<ProductState, string> = {
  Solid: 'bg-accent',
  Liquid: 'bg-anion',
  Gas: 'bg-cation',
};

export function ProductStateBadge({ state }: { state: ProductState }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-bg ${COLOR[state]}`}>
      <span aria-hidden className="h-2 w-2 rounded-full bg-bg/60" />
      {state}
    </span>
  );
}
