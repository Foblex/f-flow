import { IRoundedRect } from '@foblex/2d';
import { FConnectorBase } from '../../f-connectors';

export interface IClosestInput {

  fConnector: FConnectorBase;

  fRect: IRoundedRect;

  distance: number;
}
