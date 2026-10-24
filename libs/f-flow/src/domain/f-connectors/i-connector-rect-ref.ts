import { IRoundedRect } from '../../_libs/f-2d';
import { FConnectorBase } from '../../f-connectors';

export interface IConnectorRectRef<TConnector extends FConnectorBase = FConnectorBase> {
  connector: TConnector;
  rect: IRoundedRect; // normalized / flow space
}
