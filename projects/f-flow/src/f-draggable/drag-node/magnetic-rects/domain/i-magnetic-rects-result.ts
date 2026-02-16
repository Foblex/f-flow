import { IMagneticGapRect } from './i-magnetic-gap-rect';

export type MagneticRectsAxis = 'x' | 'y';

export type MagneticRectsAlignMode = 'top' | 'center' | 'bottom' | 'left' | 'right';

export interface IMagneticRectsResult {
  axis?: MagneticRectsAxis;
  delta?: number;
  gap?: number;
  rects: IMagneticGapRect[];
  alignMode?: MagneticRectsAlignMode;

  crossDelta?: number;
}
