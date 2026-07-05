import type { FComponentsStore } from '../../f-storage';
import { FConnectorBase } from '../f-connector-base';
import { isTargetConnector } from './is-target-connector';

/**
 * All target-capable connectors: legacy inputs plus `[fConnector]` connectors
 * with type `target` or `source-target`.
 */
export function getAllTargetConnectors(store: FComponentsStore): FConnectorBase[] {
  return [...store.inputs.getAll(), ...store.connectors.getAll().filter(isTargetConnector)];
}
