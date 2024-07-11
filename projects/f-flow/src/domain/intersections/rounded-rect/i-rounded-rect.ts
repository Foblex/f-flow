import { IRect } from '@foblex/core';
import { IConnectorShape } from '../i-connector-shape';

/// Radius in CSS order
/// topLeft, topRight, bottomRight, bottomLeft

export interface IRoundedRect extends IRect, IConnectorShape {

  radius1: number;

  radius2: number;

  radius3: number;

  radius4: number;
}
