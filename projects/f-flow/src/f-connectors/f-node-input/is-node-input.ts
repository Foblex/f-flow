export function isNodeInput(element: HTMLElement | SVGElement): boolean {
  return !!element.closest('[fNodeInput]');
}
