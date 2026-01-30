import { IPoint } from '@foblex/2d';

export class FCreateConnectionEvent {
  /** @deprecated Use `sourceId` */
  public get fOutputId(): string {
    return this.sourceId;
  }

  /** @deprecated Use `targetId` */
  public get fInputId(): string | undefined {
    return this.targetId;
  }

  /** @deprecated Use `dropPosition` */
  public get fDropPosition(): IPoint {
    return this.dropPosition;
  }

  constructor(
    public readonly sourceId: string,
    public readonly targetId: string | undefined,
    public readonly dropPosition: IPoint,
  ) {}
}
