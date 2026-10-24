export type NumberInput = string | number | null | undefined;

export function isNumber(value: NumberInput): boolean {
  return !isNaN(parseFloat(value as string)) && !isNaN(Number(value));
}
