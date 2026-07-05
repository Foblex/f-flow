export type FConnectorType = 'source' | 'target' | 'source-target' | 'outlet';

const F_CONNECTOR_TYPES: readonly FConnectorType[] = [
  'source',
  'target',
  'source-target',
  'outlet',
];

export function castToConnectorType(value: unknown): FConnectorType {
  if (value === null || value === undefined || value === '') {
    return 'source-target';
  }

  if (F_CONNECTOR_TYPES.includes(value as FConnectorType)) {
    return value as FConnectorType;
  }

  throw new Error(
    `Unknown fConnectorType: ${String(value)}. Expected one of: ${F_CONNECTOR_TYPES.join(', ')}`,
  );
}
