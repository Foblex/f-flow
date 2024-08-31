export function isGroup(element: HTMLElement | SVGElement): boolean {
  return !!element.closest('[fGroup]');
}

