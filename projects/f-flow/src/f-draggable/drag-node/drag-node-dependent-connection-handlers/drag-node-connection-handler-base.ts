import { ILine, IPoint, PointExtensions, RoundedRect } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { GetConnectorRectReferenceRequest, IConnectorRectRef } from '../../../domain';
import { FConnectorBase } from '../../../f-connectors';
import { FComponentsStore } from '../../../f-storage';
import { inject } from '@angular/core';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  FConnectionBase,
} from '../../../f-connection-v2';
import { FGeometryCache } from '../../../domain/geometry-cache';

export class DragNodeConnectionHandlerBase {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _behaviour = inject(ConnectionBehaviourBuilder);
  private readonly _cache = inject(FGeometryCache);

  private _source!: FConnectorBase;
  private _target!: FConnectorBase;

  private _sourceRef!: IConnectorRectRef;
  private _targetRef!: IConnectorRectRef;

  private _sourceDelta: IPoint = PointExtensions.initialize();
  private _targetDelta: IPoint = PointExtensions.initialize();

  public connection!: FConnectionBase;

  public initialize(connection: FConnectionBase): void {
    this.connection = connection;

    this._source = this._store.outputs.require(this.connection.fOutputId());
    this._target = this._store.inputs.require(this.connection.fInputId());

    this._sourceRef = this._readRectRef(this._source);
    this._targetRef = this._readRectRef(this._target);
  }

  public setSourceDelta(delta: IPoint): void {
    this._sourceDelta = delta;
    this._cache.setConnectorRect(
      this._source.fId(),
      this._source.kind,
      this._withDelta(this._sourceRef.rect, delta),
    );
  }

  public setTargetDelta(delta: IPoint): void {
    this._targetDelta = delta;
    this._cache.setConnectorRect(
      this._target.fId(),
      this._target.kind,
      this._withDelta(this._targetRef.rect, delta),
    );
  }

  protected redraw(): void {
    const line = this._buildLine();
    this.connection.setLine(line);
    this.connection.redraw();
  }

  private _buildLine(): ILine {
    const sourceRect = RoundedRect.fromRoundedRect(this._sourceRef.rect).addPoint(
      this._sourceDelta,
    );
    const targetRect = RoundedRect.fromRoundedRect(this._targetRef.rect).addPoint(
      this._targetDelta,
    );

    return this._behaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        sourceRect,
        targetRect,
        this.connection,
        this._sourceRef.connector.fConnectableSide,
        this._targetRef.connector.fConnectableSide,
      ),
    );
  }

  private _readRectRef(connector: FConnectorBase): IConnectorRectRef {
    return this._mediator.execute<IConnectorRectRef>(
      new GetConnectorRectReferenceRequest(connector),
    );
  }

  private _withDelta(rect: IConnectorRectRef['rect'], delta: IPoint): IConnectorRectRef['rect'] {
    return RoundedRect.fromRoundedRect(rect).addPoint(delta);
  }
}
