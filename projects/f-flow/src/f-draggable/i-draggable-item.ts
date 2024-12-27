import { IPoint } from '@foblex/2d';

export interface IDraggableItem {

  prepareDragSequence?(): void;

  onPointerMove(difference: IPoint): void;

  onPointerUp?(): void;
}
