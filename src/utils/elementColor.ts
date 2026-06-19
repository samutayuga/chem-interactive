// Category colors for element tokens — calibrated for dark background (#1a0a2e)
// Reference: Wikipedia periodic table category color scheme
const CATEGORY_COLORS: Record<string, string> = {
  AlkaliMetal:         '#ff8080',  // soft red
  AlkalineEarthMetal:  '#ffd280',  // amber
  TransitionMetal:     '#e8b84b',  // gold
  PostTransitionMetal: '#7ec8e8',  // steel blue
  Metalloid:           '#a8d8a8',  // sage green
  ReactiveNonmetal:    '#80d8e8',  // sky blue
  Halogen:             '#c8e830',  // yellow-green
  NobleGas:            '#c8aaff',  // lavender
};

export function elementColor(category: string): string {
  // istanbul ignore next
  return CATEGORY_COLORS[category] ?? '#e0d0ff';
}

const CLASS_COLORS: Record<string, string> = {
  Metal:     '#ffa040',  // warm amber-orange
  NonMetal:  '#50d8f0',  // cool cyan
  Metalloid: '#a8d8a8',  // sage green
};

export function elementClassColor(cls: string): string {
  // istanbul ignore next
  return CLASS_COLORS[cls] ?? '#e0d0ff';
}
