import { IPoint, PointExtensions } from '@foblex/2d';
import { Injector } from '@angular/core';
import { FDragHandlerResult, IFDragHandler } from '../../../f-draggable';
import { IMoveControlPointResult } from './i-move-control-point-result';
import { ConnectionWithControlPoint, FConnectionControlPointsBase } from '../../components';
import { FConnectionBase } from '../../models';

export class MoveControlPointHandler implements IFDragHandler {
  public fEventType = 'move-connection-control-point';
  public fData: unknown;

  private readonly _result: FDragHandlerResult<IMoveControlPointResult>;

  private _point: IPoint | undefined;

  private get _fControlPoints(): FConnectionControlPointsBase {
    return this._pick.connection.fControlPoints() as FConnectionControlPointsBase;
  }

  private get _connection(): FConnectionBase {
    return this._pick.connection;
  }

  constructor(
    readonly _injector: Injector,
    private readonly _pick: ConnectionWithControlPoint<FConnectionBase>,
  ) {
    this._result = _injector.get(FDragHandlerResult);
  }

  public prepareDragSequence(): void {
    if (this._pick.candidate) {
      this._point = { ...this._pick.candidate.point };
      this._fControlPoints.insert(this._pick.candidate);
    } else {
      this._point = { ...this._pick.pivot };
      this._fControlPoints.select(this._pick.pivot);
    }
    this._redrawConnection();
  }

  public onPointerMove(_difference: IPoint): void {
    this._fControlPoints.move(PointExtensions.sum(this._point!, _difference));
    this._redrawConnection();
  }

  public onPointerUp(): void {}

  private _redrawConnection(): void {
    this._connection.setLine(this._connection.line);
    this._connection.redraw();
  }
}
