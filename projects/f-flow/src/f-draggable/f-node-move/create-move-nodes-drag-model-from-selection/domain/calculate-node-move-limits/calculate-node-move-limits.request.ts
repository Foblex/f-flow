import { FNodeBase } from '../../../../../f-node';

export class CalculateNodeMoveLimitsRequest {

  constructor(
    public fNode: FNodeBase,
    public hasParentNodeInSelected: boolean
  ) {
  }
}
