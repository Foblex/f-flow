import { EFConnectorShape } from './e-f-connector-shape';
import { IPoint } from '@foblex/core';

export interface IConnectorShape {

  type: EFConnectorShape;

  gravityCenter: IPoint;
}
