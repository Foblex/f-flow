import { IPoint } from '@foblex/core';
import { EFDraggableType } from './e-f-draggable-type';

export interface IDraggableItem {

  type: EFDraggableType;

  initialize?(): void;

  move(difference: IPoint): void;

  complete?(): void;
}
