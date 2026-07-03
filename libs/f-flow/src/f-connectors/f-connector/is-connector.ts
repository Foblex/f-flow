export function isConnector(element: HTMLElement | SVGElement): boolean {
  return !!element.closest('[fConnector]');
}
