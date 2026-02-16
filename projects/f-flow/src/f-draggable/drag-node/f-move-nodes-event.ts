import { IPoint } from '@foblex/2d';

export type FMoveNodePosition = { id: string; position: IPoint };

/**
 * Event that is emitted when nodes and groups are moved.
 * It contains the moved nodes and groups and their new positions.
 */
export class FMoveNodesEvent {
  /** Preferred name */
  public readonly nodes: FMoveNodePosition[];

  /** @deprecated Use `nodes` */
  public readonly fNodes: FMoveNodePosition[];

  constructor(nodes: FMoveNodePosition[]) {
    // single source of truth, same reference
    this.nodes = nodes;
    this.fNodes = nodes;
  }
}
