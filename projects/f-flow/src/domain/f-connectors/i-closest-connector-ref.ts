import { IConnectorRectRef } from './i-connector-rect-ref';
import { FConnectorBase } from '../../f-connectors';

/**
 * Interface that describes the closest connector to a point.
 */
export interface IClosestConnectorRef<TConnector extends FConnectorBase = FConnectorBase>
  extends IConnectorRectRef<TConnector> {
  distance: number;
}
