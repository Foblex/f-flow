import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { FComponentsStore } from '../../f-storage';
import { Injector } from '@angular/core';

export class FCanvasDragHandler implements IFDragHandler {

  public fEventType = 'canvas-move';

  private readonly _store: FComponentsStore;
  private _onPointerDownPosition: IPoint = PointExtensions.initialize();

  constructor(
    _injector: Injector,
  ) {
    this._store = _injector.get(FComponentsStore);
  }

  public prepareDragSequence(): void {
    this._onPointerDownPosition = this._store.fCanvas!.transform.position;
  }

  public onPointerMove(difference: IPoint): void {
    this._store.fCanvas!.setPosition(Point.fromPoint(this._onPointerDownPosition).add(difference));
    this._store.fCanvas!.redraw();
  }

  public onPointerUp(): void {
    this._store.fCanvas!.emitCanvasChangeEvent();
  }
}
