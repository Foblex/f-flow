import { IPoint } from '@foblex/2d';

export function sizeAlongDirection(element: HTMLElement, dir: IPoint): number {
  const rect = element.getBoundingClientRect();

  return Math.abs(dir.x) * rect.width + Math.abs(dir.y) * rect.height;
}
