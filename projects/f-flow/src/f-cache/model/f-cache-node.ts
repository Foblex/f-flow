import { IRect } from '@foblex/2d';
import { IFCacheNodeRef } from './i-f-cache-node-ref';

export class FCacheNode {
  constructor(
    public readonly id: string,
    public readonly element: HTMLElement | SVGElement,
    public readonly reference: IFCacheNodeRef,
    public rect?: IRect | null,
  ) {}
}
