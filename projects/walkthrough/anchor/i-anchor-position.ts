export type HorizontalPosition = 'start' | 'center' | 'end';
export type VerticalPosition = 'top' | 'center' | 'bottom';

export interface IAnchorPosition {
  x: HorizontalPosition;
  y: VerticalPosition;
  offsetX?: number;
  offsetY?: number;
}
