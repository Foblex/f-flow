import {FNodeBase} from "../../../../f-node";

export class GetNodeBoundingIncludePaddingsRequest {
  static readonly fToken = Symbol('GetNodeBoundingIncludePaddingsRequest');

  constructor(
    public nodeOrGroup: FNodeBase
  ) {
  }
}
