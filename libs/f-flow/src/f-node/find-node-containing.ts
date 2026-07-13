import type { FComponentsStore } from '../f-storage';
import { FNodeBase } from './f-node-base';

const NODE_OR_GROUP_HOST_SELECTOR = '[data-f-node-id], [data-f-group-id]';

/**
 * Resolves the node or group whose host contains the given element in
 * O(DOM depth) via the host id attributes, instead of scanning every
 * registered node with `hostElement.contains` on each pointerdown.
 *
 * Node and group hosts are siblings inside their layer containers, so an
 * element belongs to at most one host; the instance check keeps the lookup
 * correct when several flows share the page and reuse ids.
 */
export function findNodeOrGroupContaining(
  store: FComponentsStore,
  element: HTMLElement | SVGElement,
): FNodeBase | undefined {
  const host = element.closest(NODE_OR_GROUP_HOST_SELECTOR);
  if (!host) {
    return undefined;
  }

  const id = host.getAttribute('data-f-node-id') ?? host.getAttribute('data-f-group-id');
  if (id === null) {
    return undefined;
  }

  const node = store.nodes.get(id);

  return node?.hostElement === host ? node : undefined;
}
