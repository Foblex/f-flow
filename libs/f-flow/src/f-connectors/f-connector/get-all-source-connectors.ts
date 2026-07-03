import type { FComponentsStore } from '../../f-storage';
import { FSourceConnectorBase } from '../f-source-connector-base';
import { isSourceConnector } from './is-source-connector';

/**
 * All source-capable connectors: legacy outputs plus `[fConnector]` connectors
 * with type `source` or `source-target`.
 */
export function getAllSourceConnectors(store: FComponentsStore): FSourceConnectorBase[] {
  return [...store.outputs.getAll(), ...store.connectors.getAll().filter(isSourceConnector)];
}
