import { motion } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { TransitionMetalPicker } from '../zones/TransitionMetalPicker';
import { gcd } from '../utils/gcd';
import type { BondingType, ZoneState, Slot } from '../canvas/types';

const SUPERSCRIPTS: Record<number, string> = {1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷'};

function formatIon(symbol: string, charge: number): string {
  const abs = Math.abs(charge);
  const sign = charge > 0 ? '⁺' : '⁻';
  return `${symbol}${abs === 1 ? sign : `${SUPERSCRIPTS[abs] ?? abs}${sign}`}`;
}

function chargeExplanation(zone: ZoneState): string {
  if (zone.isPolyatomic) {
    const c = zone.derivedCharge!;
    return `${zone.symbol} is a polyatomic ion with a fixed charge of ${c > 0 ? '+' : ''}${c}`;
  }
  if (zone.elementClass === 'Metal' || zone.elementClass === 'Metalloid') {
    const c = zone.derivedCharge!;
    const ve = zone.valenceElectrons;
    return `${zone.symbol} has ${ve} valence electron${ve !== 1 ? 's' : ''} → loses ${c}e⁻ → ${formatIon(zone.symbol, c)}`;
  }
  const c = Math.abs(zone.derivedCharge!);
  const ve = zone.valenceElectrons;
  return `${zone.symbol} has ${ve} valence electron${ve !== 1 ? 's' : ''} → gains ${c}e⁻ → ${formatIon(zone.symbol, -c)}`;
}

function formulaPreview(cation: ZoneState, anion: ZoneState): string {
  const cC = Math.abs(cation.derivedCharge!);
  const aC = Math.abs(anion.derivedCharge!);
  const g   = gcd(cC, aC);
  const cS  = aC / g;
  const aS  = cC / g;
  const cPart = cS === 1 ? cation.symbol : `${cation.symbol}${SUPERSCRIPTS[cS] ?? cS}`;
  const aPart = anion.isPolyatomic && aS > 1
    ? `(${anion.symbol})${SUPERSCRIPTS[aS] ?? aS}`
    : aS === 1 ? anion.symbol : `${anion.symbol}${SUPERSCRIPTS[aS] ?? aS}`;
  return `${cPart}${aPart}`;
}

function electronsNeeded(valenceElectrons: number): number {
  return valenceElectrons === 1 ? 1 : 8 - valenceElectrons;
}

function ionicCation(slotA: ZoneState, slotB: ZoneState): { cation: ZoneState; anion: ZoneState } {
  // Use derivedCharge when available (handles H⁺ and all metals correctly)
  if (slotA.derivedCharge !== null && slotB.derivedCharge !== null) {
    return slotA.derivedCharge > 0
      ? { cation: slotA, anion: slotB }
      : { cation: slotB, anion: slotA };
  }
  // Fallback for DEDUCING (TM picker open): Metal/Metalloid is cation
  const aCation = slotA.elementClass === 'Metal' || slotA.elementClass === 'Metalloid';
  return aCation ? { cation: slotA, anion: slotB } : { cation: slotB, anion: slotA };
}

function SlotPanel({ zone, slot }: { zone: ZoneState; slot: Slot }) {
  const { dispatch } = useIonicCanvas();
  if (zone.status === 'DEDUCING') {
    return (
      <div className="rounded-lg bg-white/5 p-3">
        <TransitionMetalPicker
          zone={zone}
          onPick={(charge) => dispatch({ type: 'PICK_TM_CHARGE', slot, charge })}
        />
      </div>
    );
  }
  if (zone.status === 'NEUTRAL') {
    return (
      <div className="rounded-lg bg-white/5 p-2 md:p-3 text-xs md:text-sm text-white/80">
        {zone.symbol} — charge to be determined
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-white/5 p-2 md:p-3 text-xs md:text-sm text-white/80">
      {chargeExplanation(zone)}
    </div>
  );
}

function BondingSummary({ bondingType, slotA, slotB }: { bondingType: BondingType; slotA: ZoneState; slotB: ZoneState }) {
  if (bondingType === 'Ionic') {
    const { cation, anion } = ionicCation(slotA, slotB);
    if (cation.status !== 'IONIZED' || anion.status !== 'IONIZED') return null;
    return (
      <p className="text-xs md:text-sm text-white/70 text-center">
        Crossover method: each charge becomes the other ion's subscript →{' '}
        <span className="font-bold text-white">{formulaPreview(cation, anion)}</span>
      </p>
    );
  }
  if (bondingType === 'Covalent') {
    const aN = electronsNeeded(slotA.valenceElectrons);
    const bN = electronsNeeded(slotB.valenceElectrons);
    return (
      <p className="text-xs md:text-sm text-white/70 text-center">
        {slotA.symbol} needs {aN} more electron{aN !== 1 ? 's' : ''} and {slotB.symbol} needs {bN} electron{bN !== 1 ? 's' : ''} — they share electrons to complete their octets.
      </p>
    );
  }
  const homonuclear = slotA.symbol === slotB.symbol;
  return (
    <p className="text-xs md:text-sm text-white/70 text-center">
      {homonuclear
        ? <>Each <strong className="text-white">{slotA.symbol}</strong> atom contributes <strong className="text-white">{slotA.valenceElectrons}</strong> valence electron{slotA.valenceElectrons !== 1 ? 's' : ''} to a delocalised electron sea.</>
        : <>Each <strong className="text-white">{slotA.symbol}</strong> atom contributes <strong className="text-white">{slotA.valenceElectrons}</strong> electron{slotA.valenceElectrons !== 1 ? 's' : ''} and each <strong className="text-white">{slotB.symbol}</strong> atom contributes <strong className="text-white">{slotB.valenceElectrons}</strong> electron{slotB.valenceElectrons !== 1 ? 's' : ''}.</>
      }{' '}
      The positive metal ions are held in a lattice by electrostatic attraction to the sea of electrons.
    </p>
  );
}

const BONDING_LABEL: Record<string, string> = {
  Ionic: 'Ionic Bonding', Covalent: 'Covalent Bonding', Metallic: 'Metallic Bonding',
};

export function ExplanationModal() {
  const { state, dispatch } = useIonicCanvas();
  const { slotA, slotB, bondingType, canvasPhase } = state;

  if (canvasPhase !== 'EXPLAINING' || !slotA || !slotB || !bondingType) return null;

  const neitherDeducing = slotA.status !== 'DEDUCING' && slotB.status !== 'DEDUCING';
  const applyEnabled = bondingType !== 'Ionic' || neitherDeducing;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface border border-muted/30 rounded-2xl p-4 md:p-6 max-w-md w-full mx-3 max-h-[85vh] overflow-y-auto flex flex-col gap-3 md:gap-4 shadow-2xl"
      >
        <h2 className="text-base md:text-lg font-bold text-white text-center">
          {BONDING_LABEL[bondingType]}
        </h2>

        {bondingType === 'Ionic' && (
          <div className="flex flex-col gap-2">
            <SlotPanel zone={slotA} slot="A" />
            <SlotPanel zone={slotB} slot="B" />
          </div>
        )}

        <div className="border-t border-muted/20 pt-3">
          <BondingSummary bondingType={bondingType} slotA={slotA} slotB={slotB} />
        </div>

        <button
          onClick={() => dispatch({ type: 'DISMISS_EXPLANATION' })}
          disabled={!applyEnabled}
          className={[
            'w-full py-2 rounded-xl text-sm font-bold transition-colors',
            applyEnabled
              ? 'bg-accent/30 border border-accent text-accent hover:bg-accent/50'
              : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed',
          ].join(' ')}
        >
          Apply →
        </button>
      </motion.div>
    </motion.div>
  );
}
