import {IMinMaxPoint, IRect} from "@foblex/2d";
import {FNodeBase} from "../../../../f-node";

export interface ISoftLimit {
  nodeOrGroup: FNodeBase;
  boundingRect: IRect;
  limits: IMinMaxPoint;
}
