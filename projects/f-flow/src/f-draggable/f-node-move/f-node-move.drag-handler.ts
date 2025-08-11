import { IPoint, PointExtensions } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { FNodeBase } from '../../f-node';
import { BaseConnectionDragHandler } from './connection-drag-handlers';

export class FNodeMoveDragHandler implements IFDragHandler {

  public readonly fEventType = 'move-node';

  private readonly _onPointerDownPosition = PointExtensions.initialize();

  constructor(
    public fNode: FNodeBase,
    public fSourceHandlers: BaseConnectionDragHandler[] = [],
    public fTargetHandlers: BaseConnectionDragHandler[] = [],
  ) {
    this._onPointerDownPosition = { ...fNode.position() };
  }

  public onPointerMove(difference: IPoint): void {
    this._redraw(this._calculateNewPosition(difference));

    this.fSourceHandlers.forEach((x) => x.setSourceDifference(difference));
    this.fTargetHandlers.forEach((x) => x.setTargetDifference(difference));
  }

  private _calculateNewPosition(difference: IPoint): IPoint {
    return PointExtensions.sum(this._onPointerDownPosition, difference);
  }

  private _redraw(position: IPoint): void {
    this.fNode.updatePosition(position);
    this.fNode.redraw();
  }

  public onPointerUp(): void {
    // this.fNode.updatePosition(position);
    this.fNode.position.set(this.fNode._position);
  }
}
