import { IPoint } from '@foblex/2d';
import { INodeMoveLimits } from './i-node-move-limits';

export interface INodeMoveLimitsAndPosition extends INodeMoveLimits {

  position: IPoint;
}
