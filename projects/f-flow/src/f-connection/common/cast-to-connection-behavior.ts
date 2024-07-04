import { EFConnectionBehavior } from './e-f-connection-behavior';

export function castToConnectionBehavior(behavior: string): EFConnectionBehavior {

  const result = EFConnectionBehavior[ behavior.toUpperCase() as keyof typeof EFConnectionBehavior ];

  if (result === undefined) {
    throw new Error(`Unknown connection behavior: ${ behavior }. Accepted values: ${ Object.keys(EFConnectionBehavior).join(', ') }`);
  }

  return result;
}
