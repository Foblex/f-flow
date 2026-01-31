import { IPoint } from '@foblex/2d';

export class FDropToGroupEvent {
  /** @deprecated Use `targetGroupId` */
  public get fTargetNode(): string {
    return this.targetGroupId;
  }

  /** @deprecated Use `nodeIds` */
  public get fNodes(): string[] {
    return this.nodeIds;
  }

  /** @deprecated Use `dropPosition` */
  public get fDropPosition(): IPoint {
    return this.dropPosition;
  }

  constructor(
    /** Group (target) id */
    public readonly targetGroupId: string,
    /** Dropped node ids */
    public readonly nodeIds: string[],
    /** Pointer position where the user dropped pointer. */
    public readonly dropPosition: IPoint,
  ) {}
}
