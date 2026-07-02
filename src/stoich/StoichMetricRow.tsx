import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  moles: number;
  mass: number;
}

export function StoichMetricRow({ icon, title, moles, mass }: Props) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span aria-hidden className="w-5 text-center">{icon}</span>
      <span className="flex-1 text-sm text-white">{title}</span>
      <span className="font-bold text-white">{moles.toFixed(2)} mol</span>
      <span className="text-muted text-sm">{mass.toFixed(2)} g</span>
    </div>
  );
}
