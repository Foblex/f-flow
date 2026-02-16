import { ICurrentSelection } from '../domain';

export class FSelectionChangeEvent implements ICurrentSelection {
  /** @deprecated Use `nodeIds` */
  public get fNodeIds(): string[] {
    return this.nodeIds;
  }

  /** @deprecated Use `groupIds` */
  public get fGroupIds(): string[] {
    return this.groupIds;
  }

  /** @deprecated Use `connectionIds` */
  public get fConnectionIds(): string[] {
    return this.connectionIds;
  }

  constructor(
    public readonly nodeIds: string[],
    public readonly groupIds: string[],
    public readonly connectionIds: string[],
  ) {}
}
