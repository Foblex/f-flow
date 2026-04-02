import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { DragHandlerBase } from '../../infrastructure';
import { FComponentsStore } from '../../../f-storage';

const F_CANVAS_DRAGGING_CLASS = 'f-canvas-dragging';
/** @deprecated Use `f-canvas-dragging`. */
const LEGACY_CANVAS_DRAGGING_CLASS = 'canvas-dragging';

@Injectable()
export class DragCanvasHandler extends DragHandlerBase<unknown> {
  protected readonly type = 'canvas-move';
  protected readonly kind = 'drag-canvas';

  private readonly _store = inject(FComponentsStore);
  private _onPointerDownPosition: IPoint = PointExtensions.initialize();

  constructor() {
    super();
    this._store.fCanvas?.hostElement.classList.add(
      F_CANVAS_DRAGGING_CLASS,
      LEGACY_CANVAS_DRAGGING_CLASS,
    );
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
    this._store.fCanvas?.hostElement.classList.remove(
      F_CANVAS_DRAGGING_CLASS,
      LEGACY_CANVAS_DRAGGING_CLASS,
    );
  }
}
