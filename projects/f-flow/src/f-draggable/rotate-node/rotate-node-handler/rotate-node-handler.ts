import { IPoint, IRect, ITransformModel, PointExtensions } from '@foblex/2d';
import { DragHandlerBase } from '../../infrastructure';
import { FRotateNodeStartEventData } from '../f-rotate-node-start-event-data';
import { FComponentsStore } from '../../../f-storage';
import { FMediator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { inject, Injectable } from '@angular/core';
import { FNodeBase } from '../../../f-node';
import { DragNodeConnectionHandlerBase } from '../../drag-node';
import { GetNormalizedElementRectRequest } from '../../../domain';
import { calculateDifferenceAfterRotation } from '../calculate-difference-after-rotation';
import { ROTATE_NODE_HANDLER_KIND, ROTATE_NODE_HANDLER_TYPE } from '../is-rotate-node-handler';
import { FGeometryCache } from '../../../domain/geometry-cache';

type TRotateConnectionHandler = {
  connection: DragNodeConnectionHandlerBase;
  connector: IPoint;
};

@Injectable()
export class RotateNodeHandler extends DragHandlerBase<FRotateNodeStartEventData> {
  protected readonly type = ROTATE_NODE_HANDLER_TYPE;
  protected readonly kind = ROTATE_NODE_HANDLER_KIND;

  protected override data() {
    return new FRotateNodeStartEventData(this._nodeOrGroup.fId());
  }

  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _geometryCache = inject(FGeometryCache);

  private _nodeOrGroup!: FNodeBase;
  private _sourceConnections!: TRotateConnectionHandler[];
  private _targetConnections!: TRotateConnectionHandler[];

  private _startRotation: number = 0;

  private _nodeRect!: IRect;
  private _nodeCenter!: IPoint;

  private _pointerDownInFlow!: IPoint;

  /**
   * Difference between pointer angle and node rotation at pointer-down.
   * This lets us keep rotation “locked” to the initial grab angle.
   */
  private _rotationOffsetDeg = 0;

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public initialize(
    nodeOrGroup: FNodeBase,
    sourceConnections: TRotateConnectionHandler[],
    targetConnections: TRotateConnectionHandler[],
  ): void {
    this._nodeOrGroup = nodeOrGroup;
    this._sourceConnections = sourceConnections;
    this._targetConnections = targetConnections;

    this._startRotation = this._nodeOrGroup._rotate;
  }

  public override prepareDragSequence(): void {
    this._nodeRect = this._readNodeRect();
    this._nodeCenter = this._nodeRect.gravityCenter;

    this._pointerDownInFlow = this._calculatePointerDownInFlow();
    const pointerAngleDeg = this._angleDeg(this._pointerDownInFlow);

    // pointerAngle - nodeRotation => offset
    this._rotationOffsetDeg = pointerAngleDeg - this._startRotation;
  }

  public onPointerMove(delta: IPoint): void {
    const pointerPos = PointExtensions.sum(this._pointerDownInFlow, delta);
    const pointerAngleDeg = this._angleDeg(pointerPos);

    const nextRotation = pointerAngleDeg - this._rotationOffsetDeg;
    this._applyRotation(nextRotation);

    const rotationDelta = nextRotation - this._startRotation;

    for (const h of this._sourceConnections) {
      h.connection.setSourceDelta(this._deltaAfterRotation(h.connector, rotationDelta));
    }

    for (const h of this._targetConnections) {
      h.connection.setTargetDelta(this._deltaAfterRotation(h.connector, rotationDelta));
    }
  }

  public override onPointerUp(): void {
    this._nodeOrGroup.rotate.set(this._nodeOrGroup._rotate);
    if (this._nodeOrGroup._rotate !== this._startRotation) {
      this._geometryCache.invalidateNode(this._nodeOrGroup.fId(), 'rotate-finalized');
    }
  }

  private _readNodeRect(): IRect {
    return this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(this._nodeOrGroup.hostElement),
    );
  }

  private _calculatePointerDownInFlow(): IPoint {
    return PointExtensions.sub(
      this._dragSession.onPointerDownPosition,
      PointExtensions.sum(this._transform.position, this._transform.scaledPosition),
    );
  }

  private _angleDeg(p: IPoint): number {
    return Math.atan2(p.y - this._nodeCenter.y, p.x - this._nodeCenter.x) * (180 / Math.PI);
  }

  private _applyRotation(rotationDeg: number): void {
    this._nodeOrGroup.updateRotate(rotationDeg);
    this._nodeOrGroup.redraw();
  }

  private _deltaAfterRotation(connector: IPoint, rotationDeltaDeg: number): IPoint {
    return calculateDifferenceAfterRotation(connector, rotationDeltaDeg, this._nodeCenter);
  }
}
