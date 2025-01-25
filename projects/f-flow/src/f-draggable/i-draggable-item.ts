import { IPoint } from '@foblex/2d';

export interface IDraggableItem<TData = any> {

  prepareDragSequence?(): void;

  onPointerMove(difference: IPoint): void;

  onPointerUp?(): void;

  getData?(): TData;
}
