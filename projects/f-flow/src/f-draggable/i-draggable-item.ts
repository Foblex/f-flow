import { IPoint } from '@foblex/2d';

export interface IDraggableItem {

  initialize?(): void;

  move(difference: IPoint): void;

  complete?(): void;
}
