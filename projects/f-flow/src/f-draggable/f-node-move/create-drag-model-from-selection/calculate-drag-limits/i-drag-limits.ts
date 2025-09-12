import { IMinMaxPoint } from "@foblex/2d";
import { ISoftLimit } from "./i-soft-limit";

export interface IDragLimits {
  hard: IMinMaxPoint;
  soft: ISoftLimit[];
}
