import { IPoint } from '@foblex/2d';

export interface IFDragHandler<TData = any> {

  fEventType: string;

  fData?: TData;

  prepareDragSequence?(): void;

  onPointerMove(difference: IPoint): void;

  onPointerUp?(): void;
}
