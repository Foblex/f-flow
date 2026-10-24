export function isClosestElementHasClass(element: HTMLElement | SVGElement, cls: string): boolean {
  const target = getClosest(element, cls);

  return !!target && !target.classList.contains(cls + '-disabled');
}

function getClosest(element: HTMLElement | SVGElement, cls: string): HTMLElement {
  return element.closest(cls) as HTMLElement;
}
