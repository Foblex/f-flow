import { IRect } from '@foblex/2d';
import { INodeGeometryRef } from './i-node-geometry-ref';

export class FNodeEntry {
  constructor(
    public readonly id: string,
    public readonly element: HTMLElement | SVGElement,
    public readonly reference: INodeGeometryRef,
    public rect?: IRect | null,
  ) {}

  public invalidate(): void {
    this.rect = null;
  }
}
