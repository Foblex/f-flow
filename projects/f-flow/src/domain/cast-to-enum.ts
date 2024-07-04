export function castToEnum<T>(value: any, varname: string, enm: any): T {
  const result = enm[ value.toUpperCase() as keyof typeof enm ]
    || getKeyByValue(enm, value.toLowerCase());
  if (result === undefined) {
    throw new Error(`Unknown ${ varname }: ${ value }. Accepted values: ${ Object.keys(enm).join(', ') }`);
  }
  return result;
}

function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find(key => object[key] === value);
}
