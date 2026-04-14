import { isClosestElementHasClass } from '@foblex/utils';

export function isDragBlocker(element: HTMLElement): boolean {
  return isClosestElementHasClass(element, '.f-drag-blocker');
}
