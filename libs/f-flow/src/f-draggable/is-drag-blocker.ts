import { isClosestElementHasClass } from '../_libs/f-utils';

export function isDragBlocker(element: HTMLElement | SVGElement): boolean {
  return isClosestElementHasClass(element, '.f-drag-blocker');
}
