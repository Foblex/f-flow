import { CalculateFlowStateRequest } from './calculate-flow-state-request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IFFlowState } from './i-f-flow-state';
import { FComponentsStore } from '../../../f-storage';
import { FGroupDirective, FNodeDirective } from '../../../f-node';
import { IPoint, ITransformModel, PointExtensions } from '@foblex/2d';
import { CalculateNodesStateRequest } from './calculate-nodes-state';
import { CalculateConnectionsStateRequest } from './calculate-connections-state';
import { FCanvasBase } from '../../../f-canvas';

/**
 * Execution that retrieves the current state of the Flow, including its position, scale, nodes, groups, and connections.
 */
@Injectable()
@FExecutionRegister(CalculateFlowStateRequest)
export class CalculateFlowState implements IExecution<CalculateFlowStateRequest, IFFlowState> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _transform(): ITransformModel {
    return this._canvas.transform;
  }

  private get _canvasPosition(): IPoint {
    return PointExtensions.sum(this._transform.position, this._transform.scaledPosition);
  }

  public handle(_payload: CalculateFlowStateRequest): IFFlowState {
    return {
      position: this._canvasPosition,
      scale: this._canvas.transform.scale,
      nodes: this._mediator.execute(new CalculateNodesStateRequest(FNodeDirective)),
      groups: this._mediator.execute(new CalculateNodesStateRequest(FGroupDirective)),
      connections: this._mediator.execute(new CalculateConnectionsStateRequest()),
    };
  }
}
