export function isNode(element: HTMLElement | SVGElement): boolean {
  return !!element.closest('[fNode]');
}

