import { Injectable } from '@angular/core';
import { Point } from '@foblex/core';
import { IDraggableItem } from './i-draggable-item';
import { ISelectable } from '../f-connection';
import { FLineAlignmentBase } from '../f-line-alignment';
import { FSelectionAreaBase } from '../f-selection-area';

@Injectable()
export class FDraggableDataContext {

  public selectedItems: ISelectable[] = [];

  public isSelectedChanged: boolean = false;

  public onPointerDownScale: number = 1;

  public onPointerDownPosition: Point = new Point(0, 0);

  public draggableItems: IDraggableItem[] = [];

  public fSelectionArea: FSelectionAreaBase | undefined;

  public fLineAlignment: FLineAlignmentBase | undefined;

  public reset(): void {
    this.draggableItems = [];
    this.onPointerDownScale = 1;
    this.onPointerDownPosition = new Point(0, 0);
  }

  public markSelectionAsChanged(): void {
    this.isSelectedChanged = true;
  }
}
