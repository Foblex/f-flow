import { EFConnectionType } from './e-f-connection-type';

export function castToConnectionType(type: string): EFConnectionType {

  const result = EFConnectionType[ type.toUpperCase() as keyof typeof EFConnectionType ];

  if (result === undefined) {
    throw new Error(`Unknown connection type: ${ type }. Accepted values: ${ Object.keys(EFConnectionType).join(', ') }`);
  }

  return result;
}
