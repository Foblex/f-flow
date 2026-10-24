export function isClosestElementHasClass(element: HTMLElement | SVGElement, cls: string): boolean {
  return !!element.closest(cls);
}
