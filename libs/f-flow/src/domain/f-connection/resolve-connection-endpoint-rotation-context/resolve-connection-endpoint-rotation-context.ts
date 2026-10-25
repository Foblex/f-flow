import { inject, Injectable } from '@angular/core';
import { FMediator, IExecution } from '../../../_libs/f-mediator';
import { FComponentsStore } from '../../../f-storage';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';
import {
  ResolveConnectionEndpointRotationContextRequest,
  TResolveConnectionEndpointRotationContextResponse,
} from './resolve-connection-endpoint-rotation-context-request';

@Injectable()
export class ResolveConnectionEndpointRotationContext implements IExecution<
  ResolveConnectionEndpointRotationContextRequest,
  TResolveConnectionEndpointRotationContextResponse
> {
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

    const nodeRect = this._mediator.execute(new GetNormalizedElementRectRequest(node.hostElement));

    return {
      rotationDeg: node._rotate,
      pivot: nodeRect.gravityCenter,
    };
  }
}
