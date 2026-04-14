export function isNodeOutput(element: HTMLElement | SVGElement): boolean {
  return !!element.closest('[fNodeOutput]');
}
