import { IPoint, IRect, ITransformModel, PointExtensions } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { FNodeBase } from '../../f-node';
import { FMediator } from '@foblex/mediator';
import { GetNormalizedElementRectRequest } from '../../domain';
import { fInject } from '../f-injector';
import { FDraggableDataContext } from '../f-draggable-data-context';
import { FComponentsStore } from '../../f-storage';

export class FNodeRotateDragHandler implements IFDragHandler {

  private readonly _fMediator = fInject(FMediator);
  private readonly _fComponentsStore = fInject(FComponentsStore);
  private readonly _fDraggableDataContext = fInject(FDraggableDataContext);

  public fEventType = 'node-rotate';
  public fData: any;

  private _startAngle: number = 0;

  private _fNodeRect!: IRect;
  private _onDownPoint!: IPoint;

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  constructor(
    private _fNode: FNodeBase,
  ) {
    this.fData = {
      fNodeId: _fNode.fId,
    };
  }

  public prepareDragSequence(): void {
    this._onDownPoint = this._calculateDownPoint();
    this._fNodeRect = this._getOriginalNodeRect();
    this._startAngle = this._calculateAngleBetweenVectors(this._onDownPoint) - this._fNode.rotate;
  }

  private _calculateDownPoint(): IPoint {
    const fCanvasPosition = PointExtensions.sum(this._transform.position, this._transform.scaledPosition);
    return PointExtensions.sub(this._fDraggableDataContext.onPointerDownPosition, fCanvasPosition);
  }

  private _calculateAngleBetweenVectors(position: IPoint): number {
    return Math.atan2(
      position.y - this._fNodeRect.gravityCenter.y,
      position.x - this._fNodeRect.gravityCenter.x
    ) * (180 / Math.PI);
  }

  private _getOriginalNodeRect(): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(this._fNode.hostElement, false));
  }

  public onPointerMove(difference: IPoint): void {
    const position = PointExtensions.sum(this._onDownPoint, difference);
    const angle = this._calculateAngleBetweenVectors(position) - this._startAngle!;
    this._updateNodeRendering(this._normalizeAngle(angle));
  }

  private _normalizeAngle(angle: number): number {
    return ((angle + 180) % 360) - 180;
  }

  private _updateNodeRendering(angle: number): void {
    this._fNode.updateRotate(angle);
    this._fNode.redraw();
  }

  public onPointerUp(): void {
    this._fNode.rotateChange.emit(this._fNode.rotate);
  }
}
