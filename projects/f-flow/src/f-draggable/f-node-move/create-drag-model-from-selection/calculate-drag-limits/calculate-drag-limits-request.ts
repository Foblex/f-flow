import { FNodeBase } from "../../../../f-node";

export class CalculateDragLimitsRequest {
  static readonly fToken = Symbol('CalculateDragLimitsRequest');

  constructor(
    public readonly nodeOrGroup: FNodeBase,
  ) {
  }
}
