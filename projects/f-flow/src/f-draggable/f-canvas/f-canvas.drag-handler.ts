import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { FComponentsStore } from '../../f-storage';
import { inject } from '@angular/core';

export class FCanvasDragHandler implements IFDragHandler {

  private _fComponentsStore = inject(FComponentsStore);
  private _onPointerDownPosition: IPoint = PointExtensions.initialize();

  public prepareDragSequence(): void {
    this._onPointerDownPosition = this._fComponentsStore.fCanvas!.transform.position;
  }

  public onPointerMove(difference: IPoint): void {
    this._fComponentsStore.fCanvas!.setPosition(Point.fromPoint(this._onPointerDownPosition).add(difference));
    this._fComponentsStore.fCanvas!.redraw();
  }

  public onPointerUp(): void {
    this._fComponentsStore.fCanvas!.emitCanvasChangeEvent();
  }
}
