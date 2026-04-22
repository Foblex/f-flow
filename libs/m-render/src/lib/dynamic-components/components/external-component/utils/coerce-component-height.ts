export function coerceComponentHeight(value: string | number | undefined): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? `${ value }px` : undefined;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) return undefined;

  if (normalizedValue === 'auto') return 'auto';

  const numericValue = Number(normalizedValue);
  if (Number.isFinite(numericValue) && numericValue > 0) {
    return `${ numericValue }px`;
  }

  if (/^-?\d+(\.\d+)?(px|%|vh|vw|vmin|vmax|rem|em|ch|ex|cm|mm|in|pt|pc)$/i.test(normalizedValue)) {
    return normalizedValue;
  }

  if (/^calc\(.+\)$/i.test(normalizedValue)) {
    return normalizedValue;
  }

  return undefined;
}
