import { IRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';
import {
  ResolveConnectionEndpointRotationContextRequest,
  TResolveConnectionEndpointRotationContextResponse,
} from './resolve-connection-endpoint-rotation-context-request';

@Injectable()
@FExecutionRegister(ResolveConnectionEndpointRotationContextRequest)
export class ResolveConnectionEndpointRotationContext
  implements
    IExecution<
      ResolveConnectionEndpointRotationContextRequest,
      TResolveConnectionEndpointRotationContextResponse
    >
{
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  public handle({
    connector,
  }: ResolveConnectionEndpointRotationContextRequest): TResolveConnectionEndpointRotationContextResponse {
    if (!connector) {
      return undefined;
    }

    const node = this._store.nodes.get(connector.fNodeId);
    if (!node || !node._rotate) {
      return undefined;
    }

    const nodeRect = this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(node.hostElement),
    );

    return {
      rotationDeg: node._rotate,
      pivot: nodeRect.gravityCenter,
    };
  }
}
