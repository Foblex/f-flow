export function castToEnum<T>(value: unknown, varname: string, enm: Record<string, unknown>): T {
  const input = value as string;
  const result = enm[input.toUpperCase()] || getKeyByValue(enm, input.toLowerCase());
  if (result === undefined) {
    throw new Error(
      `Unknown ${varname}: ${value}. Accepted values: ${Object.keys(enm).join(', ')}`,
    );
  }

  return result as T;
}

function getKeyByValue(object: Record<string, unknown>, value: unknown) {
  return Object.keys(object).find((key) => object[key] === value);
}
