import { Injectable } from '@angular/core';
import { IPoint, Point } from '@foblex/2d';
import { DragHandlerBase, IPointerEvent } from './infrastructure';
import { ISelectable } from '../mixins';

@Injectable()
export class FDraggableDataContext {
  public selectedItems: ISelectable[] = [];

  public isSelectedChanged: boolean = false;

  public onPointerDownScale: number = 1;

  public onPointerDownPosition: Point = new Point(0, 0);

  public draggableItems: DragHandlerBase<unknown>[] = [];

  public autoPanFrameId: number | null = null;

  public lastPointerPosition: IPoint | null = null;

  public isAutoPanCanvasMoved: boolean = false;

  public reset(): void {
    for (const h of this.draggableItems) {
      try {
        h.destroy?.();
      } catch {
        console.error(`Error while destroying drag handler of type ${h['type']}`);
      }
    }
    this.draggableItems = [];
    this.onPointerDownScale = 1;
    this.onPointerDownPosition = new Point(0, 0);
    this.autoPanFrameId = null;
    this.lastPointerPosition = null;
    this.isAutoPanCanvasMoved = false;
  }

  public markSelectionAsChanged(): void {
    this.isSelectedChanged = true;
  }

  public rememberPointerPosition(event: IPointerEvent): void {
    this.lastPointerPosition = event.getPosition();
  }

  public isEmpty(): boolean {
    return !this.draggableItems.length;
  }
}
