import { IRoundedRect } from '@foblex/2d';
import { FConnectorBase } from '../../f-connectors';

/**
 * Interface that describes the closest connector to a point.
 */
export interface IClosestConnector {

  fConnector: FConnectorBase;

  fRect: IRoundedRect;

  distance: number;
}
