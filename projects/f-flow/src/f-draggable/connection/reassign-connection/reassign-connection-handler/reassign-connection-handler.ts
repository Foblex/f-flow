import { inject, Injectable } from '@angular/core';
import { DragHandlerBase, FDragHandlerResult } from '../../../f-drag-handler';
import { IReassignConnectionEventData } from '../i-reassign-connection-event-data';
import { IReassignConnectionDragResult } from '../i-reassign-connection-drag-result';
import { FMediator } from '@foblex/mediator';
import { ConnectionBehaviourBuilder, FConnectionBase } from '../../../../f-connection-v2';
import { FComponentsStore } from '../../../../f-storage';
import { FSnapConnectionComponent } from '../../../../f-connection';
import { GetConnectorRectReferenceRequest, IConnectorRectRef } from '../../../../domain';
import { IReassignHandler, rectFromPoint } from './i-reassign-handler';
import { FNodeInputDirective, FNodeOutputDirective } from '../../../../f-connectors';
import { ReassignConnectionSourceHandler } from './reassign-connection-source-handler';
import { ReassignConnectionTargetHandler } from './reassign-connection-target-handler';
import { IPoint } from '@foblex/2d';

@Injectable()
export class ReassignConnectionHandler extends DragHandlerBase<IReassignConnectionEventData> {
  protected readonly type = 'reassign-connection';
  protected override data() {
    return { fConnectionId: this._connection.fId() };
  }

  private readonly _result =
    inject<FDragHandlerResult<IReassignConnectionDragResult>>(FDragHandlerResult);
  private readonly _mediator = inject(FMediator);
  private readonly _connectionBehaviour = inject(ConnectionBehaviourBuilder);
  private readonly _store = inject(FComponentsStore);

  private get _snapConnection(): FSnapConnectionComponent | undefined {
    return this._store.connections.getForSnap<FSnapConnectionComponent>();
  }

  private _connection!: FConnectionBase;
  private _draggedEnd!: 'source' | 'target';
  private _sourceRef!: IConnectorRectRef;
  private _targetRef!: IConnectorRectRef;

  private _reassignHandler!: IReassignHandler;

  public initialize(connection: FConnectionBase, isTargetDragHandle: boolean): void {
    this._connection = connection;
    this._draggedEnd = isTargetDragHandle ? 'target' : 'source';

    const sourceConnector = this._getSourceConnector();
    const targetConnector = this._getTargetConnector();

    this._sourceRef = this._mediator.execute<IConnectorRectRef>(
      new GetConnectorRectReferenceRequest(sourceConnector),
    );
    this._targetRef = this._mediator.execute<IConnectorRectRef>(
      new GetConnectorRectReferenceRequest(targetConnector),
    );

    this._reassignHandler =
      this._draggedEnd === 'target' ? this._createTargetHandler() : this._createSourceHandler();
  }

  private _getSourceConnector(): FNodeOutputDirective {
    const outputId = this._connection.fOutputId();
    const found = this._store.fOutputs.find((x) => x.fId() === outputId);
    if (!found) {
      throw new Error(`Connection output not found: ${outputId}`);
    }

    return found as FNodeOutputDirective;
  }

  private _getTargetConnector(): FNodeInputDirective {
    const inputId = this._connection.fInputId();
    const found = this._store.fInputs.find((x) => x.fId() === inputId);
    if (!found) {
      throw new Error(`Connection input not found: ${inputId}`);
    }

    return found as FNodeInputDirective;
  }

  private _createSourceHandler(): ReassignConnectionSourceHandler {
    return new ReassignConnectionSourceHandler(
      this._mediator,
      this._connectionBehaviour,
      this._connection,
      this._sourceRef,
      this._targetRef,
    );
  }

  private _createTargetHandler(): ReassignConnectionTargetHandler {
    return new ReassignConnectionTargetHandler(
      this._mediator,
      this._connectionBehaviour,
      this._connection,
      this._sourceRef,
      this._targetRef,
    );
  }

  public override prepareDragSequence(): void {
    this._reassignHandler.collectAndMarkCandidates();
    this._reassignHandler.setSnapConnection(this._snapConnection);

    this._result.setData({
      draggedEnd: this._draggedEnd,
      sourceAnchorRect: rectFromPoint(this._connection.line.point1),
      targetAnchorRect: rectFromPoint(this._connection.line.point2),
      candidates: this._reassignHandler.candidates(),
      connection: this._connection,
    });
  }

  public override onPointerMove(difference: IPoint): void {
    this._reassignHandler.onPointerMove(difference);
  }

  public override onPointerUp(): void {
    this._reassignHandler.onPointerUp();
  }
}
