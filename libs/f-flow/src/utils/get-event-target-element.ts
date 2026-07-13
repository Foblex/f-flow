export type FEventTargetElement = HTMLElement | SVGElement;

/** Returns `event.target`, falling back to its composed path only after Shadow DOM retargeting. */
export function getEventTargetElement(
  event: Event,
  boundarySelector?: string,
): FEventTargetElement | null {
  const target = event.target;
  const targetElement =
    target instanceof HTMLElement || target instanceof SVGElement ? target : null;

  if (targetElement && (!boundarySelector || targetElement.closest(boundarySelector))) {
    return targetElement;
  }

  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

  for (const pathTarget of path) {
    if (pathTarget instanceof HTMLElement || pathTarget instanceof SVGElement) {
      if (!boundarySelector || pathTarget.closest(boundarySelector)) {
        return pathTarget;
      }
    }
  }

  return targetElement;
}
