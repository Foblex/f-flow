import { IResizeLimit } from "./i-resize-limit";

export interface IResizeLimits {
  softLimits: IResizeLimit[];
  hardLimit: IResizeLimit | undefined;
}
