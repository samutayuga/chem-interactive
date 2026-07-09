# Reaction diagnosis & element suggestions

Date: 2026-07-09
Status: approved

## Problem

The reaction lab's compound engine (`solve_compound_reaction`) is lenient: it accepts
chemically implausible pairs (noble gases, e.g. `O + Ne` → "Synthesis feasible") and,
when it *does* fail, returns cryptic strings ("the reaction could not be balanced").
Students get no help choosing better reactants.

Empirical findings (full 118×118 scan, transition-metal charges supplied):

- The engine's **only** hard failure after TM charges are resolved is a **same-element
  pair** (`O + O`, `Na + Na`) → `"the reaction could not be balanced"` (all 50 balance
  failures were `X + X`).
- Unresolved transition-metal charge → `"X is a transition metal and requires an
  explicit charge"` (handled in the UI by the TM picker; message should be friendlier).
- Everything else is accepted, including noble gases — the lenient engine's chemistry is
  wrong here.

## Decisions (from brainstorming)

- Add a **plausibility layer** on top of the engine.
- **Flag rule (this iteration):** noble gas present in either bin.
- Also translate the engine's own failures (same-element balance failure, TM-charge) into
  friendly messages.
- **Behaviour when flagged:** *block + suggest* — suppress the (dubious) engine reaction
  and show the warning + suggestions instead.
- **Placement:** in the result panel, on **Solve** (not live).
- Suggestions are **element / category specific**.

## Design

### New pure module `src/reaction/diagnose.ts`

```ts
export interface Suggestion { symbol: string; note?: string }
export interface Diagnosis  { reason: string; hint?: string; suggestions: Suggestion[] }

export function diagnoseReaction(
  pt: PeriodicTable,
  speciesA: ZoneState[],
  speciesB: ZoneState[],
  result: WasmReactionResult,
): Diagnosis | null
```

Returns `null` → the reaction is fine, show it. Non-null → block the reaction; the panel
renders the warning + suggestions instead of the equation.

**Checks, in order:**

1. **Noble gas** in either bin (elemental species whose category is `NobleGas`):
   `reason = "{sym} is a noble gas — inert, it won't react."`
   Keeper = a representative elemental species from the *other* bin.
2. Engine `!feasible`, error contains `"could not be balanced"` → same element in both
   bins: `reason = "Two of the same element won't form a compound — pair {sym} with a
   different element."`
3. Engine `!feasible`, error mentions transition metal + charge:
   `reason = "Pick a charge for {sym} first — tap one of the charge options on its chip."`
   `suggestions = []` (the TM picker already handles it).
4. Otherwise → `null`.

### Suggestions — `suggestionsFor(pt, keeperSymbol)`

Category-based, curated (NOT engine-verified — the engine's leniency + the TM-charge
requirement make verification drop good partners like `Fe`, so we trust the curated
chemistry instead):

- Keeper is a **metal** (`AlkaliMetal | AlkalineEarthMetal | TransitionMetal |
  PostTransitionMetal`) → nonmetal partners `O, Cl, S, F, N`, note "forms an oxide / salt".
- Keeper is a **nonmetal / halogen / metalloid** (`ReactiveNonmetal | Halogen |
  Metalloid`) → metal partners `Na, Mg, Ca, Al, Fe`.
- **No keeper** (both bins noble gas, or bin empty) → generic starter
  `[{Na}, {Cl}]` with `hint = "Try a metal + a non-metal, e.g. Na + Cl."`

Candidates always exclude the keeper's own symbol. Max 5.

### UI — `ReactionResultPanel`

New optional prop `diagnosis?: Diagnosis | null`. When present, render a warning card
(amber/anion accent, high contrast) **instead of** the equation:

- `reason` line (prominent).
- optional `hint` line.
- "Try:" row of partner chips (`{symbol}{note}`).

### Wiring — `ReactionView`

After a solve produces `result`, compute
`diagnosis = diagnoseReaction(pt, reactantA, reactantB, result)` inline (pure, cheap; no
reducer change) and pass it to `ReactionResultPanel`.

## Testing

- `diagnose.test.ts` (real wasm):
  - noble gas in a bin → blocks, reason names the gas, suggests partners for the keeper.
  - same-element pair → "could not be balanced" translated to same-element message.
  - metal keeper → nonmetal suggestions; nonmetal keeper → metal suggestions.
  - feasible plausible pair (`Na + Cl`) → `null`.
- `ReactionResultPanel` render test: given a diagnosis, shows reason + suggestion chips and
  hides the equation.

## Out of scope (future)

- Flagging two-metal and two-same-type-nonmetal pairs.
- Live (pre-Solve) warnings.
