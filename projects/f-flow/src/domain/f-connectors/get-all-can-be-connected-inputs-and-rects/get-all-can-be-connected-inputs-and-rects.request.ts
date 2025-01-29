import { FNodeOutletBase, FNodeOutputBase } from '../../../f-connectors';

export class GetAllCanBeConnectedInputsAndRectsRequest {

  constructor(
    public fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase,
  ) {
  }
}
