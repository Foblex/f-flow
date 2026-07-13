/**
 * Returns hit-test results across nested open shadow roots, ordered from the
 * deepest matching element to the outermost one.
 */
export function getDeepElementsFromPoint(
  root: Document | ShadowRoot,
  x: number,
  y: number,
): Element[] {
  const result: Element[] = [];
  const visitedElements = new Set<Element>();
  const visitedRoots = new Set<Document | ShadowRoot>();

  const collect = (currentRoot: Document | ShadowRoot): void => {
    if (visitedRoots.has(currentRoot)) {
      return;
    }
    visitedRoots.add(currentRoot);

    for (const element of currentRoot.elementsFromPoint(x, y)) {
      if (element.shadowRoot) {
        collect(element.shadowRoot);
      }
      if (!visitedElements.has(element)) {
        visitedElements.add(element);
        result.push(element);
      }
    }
  };

  collect(root);

  return result;
}
