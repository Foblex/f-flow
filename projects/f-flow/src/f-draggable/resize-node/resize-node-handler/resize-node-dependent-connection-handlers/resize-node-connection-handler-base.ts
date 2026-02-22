import { ILine, IRoundedRect, RoundedRect } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { GetNormalizedConnectorRectRequest, IConnectorRectRef } from '../../../../domain';
import { FConnectorBase } from '../../../../f-connectors';
import { FComponentsStore } from '../../../../f-storage';
import { inject } from '@angular/core';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  FConnectionBase,
} from '../../../../f-connection-v2';
import { FGeometryCache } from '../../../../domain/geometry-cache';

export class ResizeNodeConnectionHandlerBase {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _behaviour = inject(ConnectionBehaviourBuilder);
  private readonly _cache = inject(FGeometryCache);

  private _source!: FConnectorBase;
  private _target!: FConnectorBase;

  private _sourceRef!: IConnectorRectRef;
  private _targetRef!: IConnectorRectRef;

  private _sourceRect!: IRoundedRect;
  private _targetRect!: IRoundedRect;

  public connection!: FConnectionBase;

  public initialize(connection: FConnectionBase): void {
    this.connection = connection;

    this._source = this._store.outputs.require(this.connection.fOutputId());
    this._target = this._store.inputs.require(this.connection.fInputId());

    this._sourceRef = this._readRectRef(this._source);
    this._targetRef = this._readRectRef(this._target);

    this._sourceRect = RoundedRect.fromRoundedRect(this._sourceRef.rect);
    this._targetRect = RoundedRect.fromRoundedRect(this._targetRef.rect);
  }

  public setSourceRect(rect: IRoundedRect): void {
    this._sourceRect = RoundedRect.fromRoundedRect(rect);
    this._cache.setConnectorRect(this._source.fId(), this._source.kind, this._sourceRect);
  }

  public setTargetRect(rect: IRoundedRect): void {
    this._targetRect = RoundedRect.fromRoundedRect(rect);
    this._cache.setConnectorRect(this._target.fId(), this._target.kind, this._targetRect);
  }

  protected redraw(): void {
    const line = this._buildLine();
    this.connection.setLine(line);
    this.connection.redraw();
  }

  private _buildLine(): ILine {
    const sourceRect = RoundedRect.fromRoundedRect(this._sourceRect);
    const targetRect = RoundedRect.fromRoundedRect(this._targetRect);

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
    return {
      connector,
      rect: this._mediator.execute<IRoundedRect>(
        new GetNormalizedConnectorRectRequest(connector.hostElement, false),
      ),
    };
  }
}
