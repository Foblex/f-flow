import { FNodeBase } from '../../../f-node';

export class DetectConnectionsUnderDragNodeRequest {
  static readonly fToken = Symbol('DetectConnectionsUnderDragNodeRequest');
  constructor(public readonly nodeOrGroup: FNodeBase) {}
}
