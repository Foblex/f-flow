import { FNodeBase } from '../../../../f-node';

export class BuildDragNodeConstraintsRequest {
  static readonly fToken = Symbol('BuildDragNodeConstraintsRequest');

  constructor(public readonly nodeOrGroup: FNodeBase) {}
}
