// export function castToEnum<T>(value: any, varname: string, enm: any): T {
//   const result = enm[ value.toUpperCase() as keyof typeof enm ]
//     || getKeyByValue(enm, value.toLowerCase());
//   if (result === undefined) {
//     throw new Error(`Unknown ${ varname }: ${ value }. Accepted values: ${ Object.keys(enm).join(', ') }`);
//   }
//   return result;
// }
//
// function getKeyByValue(object: any, value: any) {
//   return Object.keys(object).find(key => object[key] === value);
// }
export function castToEnum<T>(value: any, varname: string, enm: Record<string, T>): T {
  if (typeof value !== 'string') {
    throw new Error(`Value for ${varname} must be a string, but received: ${typeof value}`);
  }

  const normalizedValue = value.trim().toUpperCase();
  const enumValue = enm[normalizedValue as keyof typeof enm];

  if (enumValue !== undefined) {
    return enumValue;
  }

  const key = findKeyByValue(enm, value.toLowerCase());
  if (key !== undefined) {
    return enm[key];
  }

  throw new Error(
    `Unknown ${varname}: ${value}. Accepted values: ${Object.keys(enm).join(', ')}`
  );
}

function findKeyByValue<T>(object: Record<string, T>, value: any): string | undefined {
  return Object.keys(object).find(key => object[key] === value);
}
