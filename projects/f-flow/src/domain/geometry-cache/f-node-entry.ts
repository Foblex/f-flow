import { IRect } from '@foblex/2d';

export class FNodeEntry {
  constructor(
    public readonly id: string,
    public readonly element: HTMLElement | SVGElement,
    public readonly nodeRef: {
      _position: { x: number; y: number };
    },
    public rect?: IRect | null,
  ) {}

  public invalidate(): void {
    this.rect = null;
  }
}
