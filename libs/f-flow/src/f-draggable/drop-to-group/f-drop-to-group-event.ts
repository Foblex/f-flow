import { IPoint } from '@foblex/2d';

export class FDropToGroupEvent {
  /** Preferred name: Group (target) id */
  public readonly targetGroupId: string;

  /** Preferred name: Dropped node ids */
  public readonly nodeIds: string[];

  /** Preferred name: Pointer drop position */
  public readonly dropPosition: IPoint;

  /** @deprecated Use `targetGroupId` */
  public readonly fTargetNode: string;

  /** @deprecated Use `nodeIds` */
  public readonly fNodes: string[];

  /** @deprecated Use `dropPosition` */
  public readonly fDropPosition: IPoint;

  constructor(targetGroupId: string, nodeIds: string[], dropPosition: IPoint) {
    this.targetGroupId = targetGroupId;
    this.nodeIds = nodeIds;
    this.dropPosition = dropPosition;

    // legacy aliases (same values / references)
    this.fTargetNode = targetGroupId;
    this.fNodes = nodeIds;
    this.fDropPosition = dropPosition;
  }
}
