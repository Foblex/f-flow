import { FConnectorBase } from '../f-connector-base';
import { FConnectorType } from './f-connector-type';

interface IHasConnectorType {
  fConnectorType(): FConnectorType;
}

/**
 * An outlet connector is a shared start surface: it can start a drag-to-connect,
 * but a persisted connection uses a real source connector id resolved inside the
 * same node. Covers legacy outlets and `[fConnector]` with type `outlet`.
 */
export function isOutletConnector(connector: FConnectorBase): boolean {
  if (connector.kind === 'connector') {
    return (connector as unknown as IHasConnectorType).fConnectorType() === 'outlet';
  }

  return connector.kind === 'outlet';
}
