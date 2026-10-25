import { FNodeBase } from '../../../../f-node';
import type { IDragNodeDeltaConstraints } from '../../drag-node-constraint';

export class BuildDragNodeConstraintsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IDragNodeDeltaConstraints;

  static readonly fToken = Symbol('BuildDragNodeConstraintsRequest');

  constructor(public readonly nodeOrGroup: FNodeBase) {}
}
