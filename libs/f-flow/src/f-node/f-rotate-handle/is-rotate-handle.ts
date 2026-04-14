import { isClosestElementHasClass } from '@foblex/utils';

export function isRotateHandle(element: HTMLElement): boolean {
  return isClosestElementHasClass(element, '.f-rotate-handle');
}
