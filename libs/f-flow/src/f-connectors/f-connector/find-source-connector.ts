import type { FComponentsStore } from '../../f-storage';
import { FConnectorBase } from '../f-connector-base';
import { isSourceConnector } from './is-source-connector';

/**
 * Resolves a source connector id against the unified `connectors` registry first,
 * falling back to the legacy `outputs` registry.
 */
export function findSourceConnector(
  store: FComponentsStore,
  id: string,
): FConnectorBase | undefined {
  const connector = store.connectors.get(id);
  if (connector && isSourceConnector(connector)) {
    return connector;
  }

  return store.outputs.get(id);
}

export function requireSourceConnector(store: FComponentsStore, id: string): FConnectorBase {
  const connector = findSourceConnector(store, id);
  if (!connector) {
    throw new Error(`Source connector not found: ${id}`);
  }

  return connector;
}
