import { IRect } from '../../_libs/f-2d';
import { FNodeBase } from '../../f-node';

export interface INodeWithRect {
  node: FNodeBase;

  rect: IRect;
}
