export function isNodeOutlet(element: HTMLElement | SVGElement): boolean {
  return !!element.closest('[fNodeOutlet]');
}
