export function isElementWithClass(element: HTMLElement | SVGElement, cls: string): boolean {
  const target = getClosestDragHandle(element, cls);
  return !!target && !target.classList.contains(cls + '-disabled');
}

function getClosestDragHandle(element: HTMLElement | SVGElement, cls: string): HTMLElement {
  return element.closest(cls) as HTMLElement;
}
