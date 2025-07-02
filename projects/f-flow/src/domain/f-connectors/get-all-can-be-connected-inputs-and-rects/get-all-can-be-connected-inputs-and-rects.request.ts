import { FNodeOutletBase, FNodeOutputBase } from '../../../f-connectors';

export class GetAllCanBeConnectedInputsAndRectsRequest {
  static readonly fToken = Symbol('GetAllCanBeConnectedInputsAndRectsRequest');
  constructor(
    public fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase,
  ) {
  }
}
