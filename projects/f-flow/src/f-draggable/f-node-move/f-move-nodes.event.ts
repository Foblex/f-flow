import { IPoint } from '@foblex/2d';

/**
 * Event that is emitted when nodes and groups are moved.
 * It contains the moved nodes and groups and their new positions.
 */
export class FMoveNodesEvent {
  constructor(public readonly fNodes: { id: string; position: IPoint }[]) {}
}
