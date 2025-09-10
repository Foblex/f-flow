import { IMinMaxPoint, IRect, ISize } from "@foblex/2d";
import { FNodeBase } from "../../../../f-node";

export interface ISoftLimit {
  nodeOrGroup: FNodeBase;
  boundingRect: IRect;
  initialSize: ISize | undefined;
  limits: IMinMaxPoint;
}
