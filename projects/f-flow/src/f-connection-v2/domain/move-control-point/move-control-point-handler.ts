import { IPoint } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { Injector } from '@angular/core';
import { FDragHandlerResult, IFDragHandler } from '../../../f-draggable';
import { FConnectionBase } from '../../../f-connection';
import { IMoveControlPointResult } from './i-move-control-point-result';
import { FComponentsStore } from '../../../f-storage';

export class MoveControlPointHandler implements IFDragHandler {
  public fEventType = 'move-control-point';
  public fData: unknown;

  private readonly _result: FDragHandlerResult<IMoveControlPointResult>;
  private readonly _mediator: FMediator;
  private readonly _store: FComponentsStore;

  constructor(
    readonly _injector: Injector,
    private readonly _connection: FConnectionBase,
    private readonly _position: IPoint,
  ) {
    this._result = _injector.get(FDragHandlerResult);
    this._mediator = _injector.get(FMediator);
    this._store = _injector.get(FComponentsStore);
  }

  public prepareDragSequence(): void {}

  public onPointerMove(_difference: IPoint): void {}

  public onPointerUp(): void {}
}
