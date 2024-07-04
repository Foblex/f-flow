import { EFConnectableSide } from './e-f-connectable-side';

export function castToConnectableSide(type: string): EFConnectableSide {

  const result = EFConnectableSide[ type.toUpperCase() as keyof typeof EFConnectableSide ];

  if (result === undefined) {
    throw new Error(`Unknown connectable side: ${ type }. Accepted values: ${ Object.keys(EFConnectableSide).join(', ') }`);
  }

  return result;
}
