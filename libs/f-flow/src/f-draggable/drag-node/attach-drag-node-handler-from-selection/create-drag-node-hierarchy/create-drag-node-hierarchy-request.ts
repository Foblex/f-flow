import { FNodeBase } from '../../../../f-node';

export class CreateDragNodeHierarchyRequest {
  static readonly fToken = Symbol('CreateDragNodeHierarchyRequest');

  /** Selected nodes and groups including their deep children. */
  constructor(public readonly nodesAndGroups: FNodeBase[]) {}
}
