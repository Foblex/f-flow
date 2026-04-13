export function stringAttribute(value: unknown): string | undefined {
  return value ? `${value}` : undefined;
}
