import { IRoundedRect } from '@foblex/2d';
import { FConnectorBase } from '../../f-connectors';

export interface IClosestConnector {

  fConnector: FConnectorBase;

  fRect: IRoundedRect;

  distance: number;
}
