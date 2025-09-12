import { FNodeBase } from "../../../../f-node";
import { IRect } from "@foblex/2d";

export class GetNodeBoundingIncludePaddingsResponse {

  constructor(
    public nodeOrGroup: FNodeBase,
    public boundingRect: IRect,
    public innerRect: IRect,
    public paddings: [number, number, number, number],
  ) {
  }
}
