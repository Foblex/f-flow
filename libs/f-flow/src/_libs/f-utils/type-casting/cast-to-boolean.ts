export type BooleanInput = string | boolean | null | undefined;

export function castToBoolean(value: BooleanInput): boolean {
  return value != null && `${value}` !== 'false';
}
