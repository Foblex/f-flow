import { IRoundedRect } from '../../../../_libs/f-2d';
import { IConnectionEndpoints } from './i-connection-endpoints';

export interface IConnectionGeometry extends IConnectionEndpoints {
  sourceRect: IRoundedRect;
  targetRect: IRoundedRect;
}
