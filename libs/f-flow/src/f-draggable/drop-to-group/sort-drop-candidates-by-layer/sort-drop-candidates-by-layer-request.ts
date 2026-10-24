import { INodeWithRect } from '../../domain';

export class SortDropCandidatesByLayerRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: INodeWithRect[];

  static readonly fToken = Symbol('SortDropCandidatesByLayerRequest');
  constructor(public readonly candidates: INodeWithRect[]) {}
}
