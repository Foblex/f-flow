import { ILine } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
} from '../../../../../f-connection-v2';
import {
  ResolveConnectionEndpointRotationContextRequest,
  TResolveConnectionEndpointRotationContextResponse,
} from '../../../resolve-connection-endpoint-rotation-context';
import { BuildConnectionLineRequest } from './build-connection-line-request';
import { FConnectorBase } from '../../../../../f-connectors';

@Injectable()
@FExecutionRegister(BuildConnectionLineRequest)
export class BuildConnectionLine implements IExecution<BuildConnectionLineRequest, ILine> {
  private readonly _mediator = inject(FMediator);
  private readonly _connectionBehaviour = inject(ConnectionBehaviourBuilder);

  public handle({ connection, geometry }: BuildConnectionLineRequest): ILine {
    return this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        geometry.sourceRect,
        geometry.targetRect,
        connection,
        geometry.source.fConnectableSide,
        geometry.target.fConnectableSide,
        this._resolveRotationContext(geometry.source),
        this._resolveRotationContext(geometry.target),
      ),
    );
  }

  private _resolveRotationContext(
    connector: FConnectorBase,
  ): TResolveConnectionEndpointRotationContextResponse {
    return this._mediator.execute<TResolveConnectionEndpointRotationContextResponse>(
      new ResolveConnectionEndpointRotationContextRequest(connector),
    );
  }
}
