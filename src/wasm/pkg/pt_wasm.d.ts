/* tslint:disable */
/* eslint-disable */
export interface WasmCovalentStoich {
    n_a: number;
    n_b: number;
    bond_order: number;
}

export interface WasmElement {
    atomic_number: number;
    name: string;
    symbol: string;
    atomic_mass: number;
    mass_number: number;
    melting_point: number | undefined;
    boiling_point: number | undefined;
    density: number | undefined;
    electronegativity: number | undefined;
    state: string;
    discovery_year: number | undefined;
    discoverer: string | undefined;
    isotopes: WasmIsotope[];
    electron_configuration: string;
    group: number;
    period: number;
    block: string;
    category: string;
    oxidation_states: number[];
    computed_atomic_mass: number | undefined;
    class: string;
}

export interface WasmIsotope {
    mass_number: number;
    relative_mass: number;
    abundance: number;
}

export interface WasmPolyatomicIon {
    symbol: string;
    name: string;
    charge: number;
    formula: string;
}

export interface WasmReactantInput {
    symbol: string;
    subscript: number;
    amount: number | undefined;
    unit: string | undefined;
}

export interface WasmReaction {
    bonding: string;
    glyph: string;
    product_state: string;
    covalent: WasmCovalentStoich | undefined;
    metallic_electrons: number | undefined;
}

export interface WasmStoichResult {
    coeff_a: number;
    coeff_b: number;
    coeff_product: number;
    product_molar_mass: number;
    limiting: string;
    yield_moles: number;
    yield_mass: number;
    excess_moles: number;
    excess_mass: number;
    diatomic_messages: string[];
}

export type WasmElementClass = "Metal" | "NonMetal" | "Metalloid";


export class PeriodicTable {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns all 118 elements as a JS array (serialised via serde-wasm-bindgen).
     */
    all(): any;
    by_atomic_mass(mass: number, tolerance: number): WasmElement | undefined;
    by_atomic_number(z: number): WasmElement | undefined;
    by_name(name: string): WasmElement | undefined;
    by_symbol(symbol: string): WasmElement | undefined;
    /**
     * Loads all 118 elements from bundled data. Synchronous.
     */
    static load(): PeriodicTable;
    /**
     * The six common polyatomic ions, as a JS array.
     */
    polyatomic_ions(): any;
    /**
     * Classify the synthesis of two elemental reactants (bonding type, reaction
     * glyph, product state, plus covalent structure or metallic electron count).
     * Returns undefined if either symbol is unknown.
     */
    react(a: string, b: string): WasmReaction | undefined;
    /**
     * Solve a binary synthesis: balanced equation, limiting reactant, yield and
     * excess. Atomic masses and diatomic status are looked up from the table.
     * Returns undefined if either reactant symbol is unknown.
     */
    solve_stoichiometry(a: WasmReactantInput, b: WasmReactantInput): WasmStoichResult | undefined;
    /**
     * Returns "Solid", "Liquid", or "Gas" for the given symbol at temperature_k.
     * Returns undefined if symbol unknown or melting/boiling points absent.
     */
    state_at(symbol: string, temperature_k: number): string | undefined;
    /**
     * Highest-shell valence electrons for the element, or undefined if unknown.
     */
    valence_electrons(symbol: string): number | undefined;
}
