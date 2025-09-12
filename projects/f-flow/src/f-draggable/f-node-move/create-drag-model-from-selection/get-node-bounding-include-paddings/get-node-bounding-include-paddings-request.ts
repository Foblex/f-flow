import { FNodeBase } from "../../../../f-node";

export class GetNodeBoundingIncludePaddingsRequest {
  static readonly fToken = Symbol('GetNodeBoundingIncludePaddingsRequest');

  constructor(
    public readonly nodeOrGroup: FNodeBase,
    public readonly childrenPaddings: [number, number, number, number],
  ) {
  }
}
