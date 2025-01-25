import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { IDraggableItem } from '../i-draggable-item';
import { FComponentsStore } from '../../f-storage';

export class CanvasDragHandler implements IDraggableItem {

  private onPointerDownPosition: IPoint = PointExtensions.initialize();

  constructor(
      private _fComponentsStore: FComponentsStore
  ) {
  }

  public prepareDragSequence(): void {
    this.onPointerDownPosition = this._fComponentsStore.fCanvas!.transform.position;
  }

  public onPointerMove(difference: IPoint): void {
    this._fComponentsStore.fCanvas!.setPosition(Point.fromPoint(this.onPointerDownPosition).add(difference));
    this._fComponentsStore.fCanvas!.redraw();
  }

  public onPointerUp(): void {
    this._fComponentsStore.fCanvas!.emitCanvasChangeEvent();
  }
}
