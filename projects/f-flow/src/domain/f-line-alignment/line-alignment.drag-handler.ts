import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { IDraggableItem } from '../../f-draggable';
import { FComponentsStore } from '../../f-storage';

export class LineAlignmentDragHandler implements IDraggableItem {

  private readonly _onPointerDownPosition = PointExtensions.initialize();

  constructor(
    private _fComponentsStore: FComponentsStore,
    public minDistance: IPoint,
    public maxDistance: IPoint,
  ) {
    //this._onPointerDownPosition = { ...fNode.position };
  }

  public onPointerMove(difference: IPoint): void {
  }

  private _getPosition(difference: IPoint): IPoint {
    return Point.fromPoint(this._onPointerDownPosition).add(difference);
  }

  public onPointerUp(): void {
  }
}
