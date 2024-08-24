import { IPoint } from '@foblex/core';

export interface IDraggableItem {

  initialize?(): void;

  move(difference: IPoint): void;

  complete?(): void;
}
