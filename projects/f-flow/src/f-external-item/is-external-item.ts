export function isExternalItem(element: HTMLElement | SVGElement): boolean {
  return !!element.closest('[fExternalItem]');
}

export function getExternalItem(element: HTMLElement | SVGElement): HTMLElement | SVGElement {
  return element.closest('[fExternalItem]') as HTMLElement | SVGElement;
}
