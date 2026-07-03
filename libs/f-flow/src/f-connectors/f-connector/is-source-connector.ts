import { FConnectorBase } from '../f-connector-base';
import { FSourceConnectorBase } from '../f-source-connector-base';
import { FConnectorType } from './f-connector-type';

interface IHasConnectorType {
  fConnectorType(): FConnectorType;
}

/**
 * A source-capable connector can start a connection and be persisted as
 * `fSourceId` (`fOutputId`). Covers legacy outputs and `[fConnector]` with
 * type `source` or `source-target`.
 */
export function isSourceConnector(connector: FConnectorBase): connector is FSourceConnectorBase {
  if (connector.kind === 'connector') {
    const type = (connector as unknown as IHasConnectorType).fConnectorType();

    return type === 'source' || type === 'source-target';
  }

  return connector.kind === 'output';
}
