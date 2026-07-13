import { isClosestElementHasClass } from '@foblex/utils';

export function isDragBlocker(element: HTMLElement | SVGElement): boolean {
  return isClosestElementHasClass(element, '.f-drag-blocker');
}
