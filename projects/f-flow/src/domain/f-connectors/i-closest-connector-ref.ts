import { IConnectorRectRef } from './i-connector-rect-ref';

/**
 * Interface that describes the closest connector to a point.
 */
export interface IClosestConnectorRef extends IConnectorRectRef {
  distance: number;
}
