import { IRect } from '../../../_libs/f-2d';
import { FNodeBase } from '../../../f-node';

export interface IResizeLimit {
  boundingRect: IRect;
  innerRect: IRect;
  nodeOrGroup: FNodeBase;
}
