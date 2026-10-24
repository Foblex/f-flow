/// Radius in CSS order
/// topLeft, topRight, bottomRight, bottomLeft
import { IRect } from '../rect';

export interface IRoundedRect extends IRect {
  radius1: number;

  radius2: number;

  radius3: number;

  radius4: number;
}
