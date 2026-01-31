import { INodeWithRect } from '../../domain';

export class SortDropCandidatesByLayerRequest {
  static readonly fToken = Symbol('SortDropCandidatesByLayerRequest');
  constructor(public readonly candidates: INodeWithRect[]) {}
}
