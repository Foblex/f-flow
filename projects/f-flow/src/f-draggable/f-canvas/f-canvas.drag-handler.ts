import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { FDragHandlerBase } from '../f-drag-handler';
import { FComponentsStore } from '../../f-storage';
import { Injector } from '@angular/core';

export class FCanvasDragHandler extends FDragHandlerBase<unknown> {
  protected readonly type = 'canvas-move';

  private readonly _store: FComponentsStore;
  private _onPointerDownPosition: IPoint = PointExtensions.initialize();

  constructor(_injector: Injector) {
    super();
    this._store = _injector.get(FComponentsStore);
    this._store.fCanvas?.hostElement.classList.add('canvas-dragging');
  }

  public override prepareDragSequence(): void {
    this._onPointerDownPosition = this._store.transform.position;
  }

  public onPointerMove(difference: IPoint): void {
    this._store.fCanvas?.setPosition(Point.fromPoint(this._onPointerDownPosition).add(difference));
    this._store.fCanvas?.redraw();
  }

  public override onPointerUp(): void {
    this._store.fCanvas?.emitCanvasChangeEvent();
    this._store.fCanvas?.hostElement.classList.remove('canvas-dragging');
  }
}
