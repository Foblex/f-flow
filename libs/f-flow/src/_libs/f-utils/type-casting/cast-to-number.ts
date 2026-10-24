import { isNumber, NumberInput } from './is-number';

export function castToNumber(value: NumberInput, fallbackValue = 0): number {
  return isNumber(value) ? Number(value) : fallbackValue;
}
