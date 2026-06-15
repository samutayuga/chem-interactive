# Technical Specification: Interactive Cross-Over Canvas (Revised)

## 1. Objective & Target Audience
*   **Purpose**: Provide an interactive canvas for Singapore Secondary 3 students to build ionic formulas starting from raw elements. The app leverages electron configurations to help students deduce ionic charges before crossing them over.
*   **Target Audience**: 15-year-old O-Level/IP chemistry students using school-issued iPads, Chromebooks, or laptops.

---

## 2. Core Functional Requirements

### 2.1 Neutral Element Tray (The Starting Point)
*   A horizontal, scrollable tray at the top of the screen displaying **neutral atoms** (e.g., `Mg`, `O`, `Fe`, `Cl`).
*   No charges are shown yet. It displays only the Atomic Number, Element Symbol, and English Name.
*   *Exception*: A small secondary tab provides standard polyatomic ions ($\text{OH}^-$, $\text{NO}_3^-$, etc.) since these groups are memorized as pre-charged units in the syllabus.

### 2.2 Drop Zones & "Deduce Charge" Step
When a student drags a neutral element into the Cation (Left) or Anion (Right) canvas zone, the app locks the screen into a **Deduction Phase**:

1.  **Read Aufbau Configuration**: The app pulls the electron configuration from the Rust backend.
2.  **Display Valence Count**: The app displays a visual callout (e.g., *"Oxygen has 6 valence electrons"* or *"Magnesium has 2 valence electrons"*).
3.  **Interactive Valency Challenge**: Before showing the charge, the UI displays a small prompt:
    *   For Metals: `"To achieve a stable octet structure, this atom must [Lose] [2] electrons."` (Dropdown/button choices).
    *   For Non-Metals: `"To achieve a stable octet structure, this atom must [Gain] [2] electrons."`
4.  **The Ion Transformation**: Once the student answers correctly, an animation triggers:
    *   If Magnesium loses 2 electrons, show 2 negative dots floating away, and the symbol dynamically transforms from neutral `Mg` to the ion `Mg²⁺`.

### 2.3 The Cross-Over Animation Engine
This button unlocks *only* after both neutral elements have been successfully converted into ions by the student.

1.  **Frame 1 (Isolate Valency)**: The positive ($+$) and negative ($-$) signs fade out from the newly formed superscripts, leaving behind only the absolute valency numbers as integers.
2.  **Frame 2 (The Criss-Cross Track)**: The integers animate downward along diagonal paths (crossing each other in an `X` shape) to the bottom-right subscripts of the *opposite* element symbols.
3.  **Frame 3 (The Polyatomic Bracket Check)**: 
    *   If the target element is a polyatomic ion AND the incoming valency number is $> 1$:
    *   Animate parenthetical brackets `()` dropping from above to encircle the polyatomic symbol block before the subscript snaps into place.
4.  **Frame 4 (Mathematical Simplification)**:
    *   Calculate the Greatest Common Divisor ($\text{GCD}$) of the two subscripts.
    *   If $\text{GCD} > 1$ (e.g., $\text{Mg}_2\text{O}_2$), trigger a fade animation displaying a dividing step: $\div 2$, reducing them to their lowest empirical ratio (e.g., $\text{MgO}$).

---

## 3. Component Architecture & State Management

### 3.1 Main State Object Schema
The state machine now tracks the progression from a neutral atom to an ion, and finally to a compound:

```typescript
interface IonicCanvasState {
  cation: {
    symbol: string;
    atomicNumber: number;
    valenceElectrons: number;
    isTransition: boolean;
    status: 'NEUTRAL' | 'CHARGE_DEDUCED' | 'IONIZED'; 
    derivedCharge: number; // e.g., 2 for Mg2+
  } | null;
  anion: {
    symbol: string;
    atomicNumber: number;
    valenceElectrons: number;
    status: 'NEUTRAL' | 'CHARGE_DEDUCED' | 'IONIZED';
    derivedCharge: number; // e.g., -2 for O2-
  } | null;
  canvasPhase: 'SELECTING' | 'DEDUCING_CHARGE' | 'READY_TO_CROSS' | 'ANIMATING_CROSSOVER' | 'COMPLETE';
}
```

---

## 4. Technical Test Cases for QA Verification


| Initial Elements Chosen | Student Deduction Steps Required | Mid-State Ions | Expected Final Formula |
| :--- | :--- | :--- | :--- |
| `Mg` + `Cl` | Deduce Mg loses 2e⁻; Deduce Cl gains 1e⁻ | `Mg²⁺` + `Cl⁻` | $\text{MgCl}_2$ |
| `Ca` + `O` | Deduce Ca loses 2e⁻; Deduce O gains 2e⁻ | `Ca²⁺` + `O²⁻` | $\text{CaO}$ (Simplifies from $\text{Ca}_2\text{O}_2$) |
| `Fe` + `O` | Select Iron(III) from menu $\rightarrow$ UI autofills 3e⁻ lost | `Fe³⁺` + `O²⁻` | $\text{Fe}_2\text{O}_3$ |

## Techologocal Stacks
react, tailwindcss,vite, webassembly, material ui, framer-motion

The `periodic-table` function is provided as a `wasm` file at `/Users/putumas.mertayasa.e/Developer/tools/sam-periodic-table/pkg/pt_wasm.js`
