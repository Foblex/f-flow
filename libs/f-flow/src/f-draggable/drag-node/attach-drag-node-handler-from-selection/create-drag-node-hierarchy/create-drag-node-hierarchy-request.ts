import { FNodeBase } from '../../../../f-node';
import type { DragNodeHierarchy } from './drag-node-hierarchy';

export class CreateDragNodeHierarchyRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: DragNodeHierarchy;

  static readonly fToken = Symbol('CreateDragNodeHierarchyRequest');

  /** Selected nodes and groups including their deep children. */
  constructor(public readonly nodesAndGroups: FNodeBase[]) {}
}
