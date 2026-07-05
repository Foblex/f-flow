import type { FComponentsStore } from '../../f-storage';
import { FConnectorBase } from '../f-connector-base';
import { isTargetConnector } from './is-target-connector';

/**
 * Resolves a target connector id against the unified `connectors` registry first,
 * falling back to the legacy `inputs` registry.
 */
export function findTargetConnector(
  store: FComponentsStore,
  id: string,
): FConnectorBase | undefined {
  const connector = store.connectors.get(id);
  if (connector && isTargetConnector(connector)) {
    return connector;
  }

  return store.inputs.get(id);
}

export function requireTargetConnector(store: FComponentsStore, id: string): FConnectorBase {
  const connector = findTargetConnector(store, id);
  if (!connector) {
    throw new Error(`Target connector not found: ${id}`);
  }

  return connector;
}
