import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { IDraggableItem } from '../i-draggable-item';
import { FComponentsStore } from '../../f-storage';

export class CanvasDragHandler implements IDraggableItem {

  private onPointerDownPosition: IPoint = PointExtensions.initialize();

  constructor(
      private fComponentsStore: FComponentsStore
  ) {
  }

  public initialize(): void {
    this.onPointerDownPosition = this.fComponentsStore.fCanvas!.transform.position;
  }

  public move(difference: IPoint): void {
    this.fComponentsStore.fCanvas!.setPosition(Point.fromPoint(this.onPointerDownPosition).add(difference));
    this.fComponentsStore.fCanvas!.redraw();
  }

  public complete(): void {
    this.fComponentsStore.fCanvas!.emitCanvasChangeEvent();
  }
}
