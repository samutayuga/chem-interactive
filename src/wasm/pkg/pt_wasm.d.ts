/* tslint:disable */
/* eslint-disable */
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
     * Returns "Solid", "Liquid", or "Gas" for the given symbol at temperature_k.
     * Returns undefined if symbol unknown or melting/boiling points absent.
     */
    state_at(symbol: string, temperature_k: number): string | undefined;
}
