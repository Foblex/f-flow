import { Injectable } from '@angular/core';
import { Point } from '@foblex/2d';
import { IFDragHandler } from './f-drag-handler';
import { ISelectable } from '../mixins';

@Injectable()
export class FDraggableDataContext {

  public isDragging: boolean = false;

  public selectedItems: ISelectable[] = [];

  public isSelectedChanged: boolean = false;

  public onPointerDownScale: number = 1;

  public onPointerDownPosition: Point = new Point(0, 0);

  public draggableItems: IFDragHandler[] = [];

  public reset(): void {
    this.draggableItems = [];
    this.onPointerDownScale = 1;
    this.onPointerDownPosition = new Point(0, 0);
  }

  public markSelectionAsChanged(): void {
    this.isSelectedChanged = true;
  }

  public isEmpty(): boolean {
    return !this.draggableItems.length;
  }
}
