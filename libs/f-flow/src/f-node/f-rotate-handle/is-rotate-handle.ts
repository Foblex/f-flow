import { isClosestElementHasClass } from '../../_libs/f-utils';

export function isRotateHandle(element: HTMLElement): boolean {
  return isClosestElementHasClass(element, '.f-rotate-handle');
}
