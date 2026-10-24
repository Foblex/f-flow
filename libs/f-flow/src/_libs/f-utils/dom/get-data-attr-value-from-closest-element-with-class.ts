export function getDataAttrValueFromClosestElementWithClass<T>(
  element: HTMLElement,
  attr: string,
  cls: string,
): T | undefined {
  return getClosestTarget(element, cls)?.dataset[attr] as T | undefined;
}

function getClosestTarget(element: HTMLElement | SVGElement, cls: string): HTMLElement | null {
  return element.closest(cls);
}
