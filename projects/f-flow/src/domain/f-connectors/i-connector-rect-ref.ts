import { IRoundedRect } from '@foblex/2d';
import { FConnectorBase } from '../../f-connectors';

export interface IConnectorRectRef {
  connector: FConnectorBase;
  rect: IRoundedRect; // normalized / flow space
}
