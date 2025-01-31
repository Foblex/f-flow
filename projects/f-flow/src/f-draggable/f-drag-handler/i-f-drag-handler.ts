import { IPoint } from '@foblex/2d';

export interface IFDragHandler<TData = any> {

  prepareDragSequence?(): void;

  onPointerMove(difference: IPoint): void;

  onPointerUp?(): void;

  getData?(): TData;
}
