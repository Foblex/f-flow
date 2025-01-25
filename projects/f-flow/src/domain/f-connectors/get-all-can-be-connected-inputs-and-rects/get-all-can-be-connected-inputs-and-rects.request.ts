import { FNodeOutletDirective, FNodeOutputDirective } from '../../../f-connectors';

export class GetAllCanBeConnectedInputsAndRectsRequest {

  constructor(
    public fOutput: FNodeOutputDirective | FNodeOutletDirective,
  ) {
  }
}
