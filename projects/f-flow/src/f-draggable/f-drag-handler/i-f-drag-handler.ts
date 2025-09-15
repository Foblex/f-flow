import { IPoint } from '@foblex/2d';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IFDragHandler<TData = any> {
  fEventType: string;

  fData?: TData;

  prepareDragSequence?(): void;

  onPointerMove(difference: IPoint): void;

  onPointerUp?(): void;
}
