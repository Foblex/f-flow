import { EmbeddedViewRef } from '@angular/core';

export function getOrCreateRootNodeForViewRef(
  ref: EmbeddedViewRef<unknown>,
  _document: Document,
): HTMLElement {
  const rootNodes: Node[] = ref.rootNodes;

  if (rootNodes.length === 1 && rootNodes[0].nodeType === _document.ELEMENT_NODE) {
    return rootNodes[0] as HTMLElement;
  }

  const wrapper = _document.createElement('div');
  rootNodes.forEach((node) => wrapper.appendChild(node));

  return wrapper;
}
