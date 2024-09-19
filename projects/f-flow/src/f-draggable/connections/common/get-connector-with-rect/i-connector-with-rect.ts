import { IRoundedRect } from '@foblex/2d';
import { FConnectorBase } from '../../../../f-connectors';

export interface IConnectorWithRect {

  fConnector: FConnectorBase;

  fRect: IRoundedRect;
}
