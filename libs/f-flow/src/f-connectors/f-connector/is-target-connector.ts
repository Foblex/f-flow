import { FConnectorBase } from '../f-connector-base';
import { FConnectorType } from './f-connector-type';

interface IHasConnectorType {
  fConnectorType(): FConnectorType;
}

/**
 * A target-capable connector can accept a connection and be persisted as
 * `fTargetId` (`fInputId`). Covers legacy inputs and `[fConnector]` with
 * type `target` or `source-target`.
 */
export function isTargetConnector(connector: FConnectorBase): boolean {
  if (connector.kind === 'connector') {
    const type = (connector as unknown as IHasConnectorType).fConnectorType();

    return type === 'target' || type === 'source-target';
  }

  return connector.kind === 'input';
}
