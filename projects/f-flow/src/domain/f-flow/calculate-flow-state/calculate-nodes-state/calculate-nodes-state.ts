import { inject, Injectable } from '@angular/core';
import { CalculateNodesStateRequest } from './calculate-nodes-state-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IFFlowStateNode } from '../i-f-flow-state-node';
import { FComponentsStore } from '../../../../f-storage';
import { IFFlowStateConnector } from '../i-f-flow-state-connector';
import { GetNormalizedElementRectRequest } from '../../../get-normalized-element-rect';
import { IRect } from '@foblex/2d';

/**
 * Execution that retrieves the state of Flow nodes, including their position, size, inputs, outputs, and selection status.
 */
@Injectable()
@FExecutionRegister(CalculateNodesStateRequest)
export class CalculateNodesState
  implements IExecution<CalculateNodesStateRequest, IFFlowStateNode[]>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  public handle({ component, measuredSize }: CalculateNodesStateRequest): IFFlowStateNode[] {
    return this._store.nodes
      .getAll()
      .filter((x) => x instanceof component)
      .map((x) => {
        const measuredRect = measuredSize
          ? this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement))
          : null;

        return {
          id: x.fId(),
          parentId: x.fParentId() ?? undefined,
          position: { ...x._position },
          size: x._size ? { ...x._size } : undefined,
          measuredSize: measuredRect
            ? {
                width: measuredRect.width,
                height: measuredRect.height,
              }
            : undefined,
          rotate: x._rotate,
          fOutputs: this._getOutputs(x.hostElement),
          fInputs: this._getInputs(x.hostElement),
          isSelected: x.isSelected(),
        };
      });
  }

  private _getOutputs(hostElement: HTMLElement): IFFlowStateConnector[] {
    return this._store.outputs
      .getAll()
      .filter((x) => hostElement.contains(x.hostElement))
      .map((x) => {
        return {
          id: x.fId(),
          fConnectableSide: x.fConnectableSide,
        };
      });
  }

  private _getInputs(hostElement: HTMLElement): IFFlowStateConnector[] {
    return this._store.inputs
      .getAll()
      .filter((x) => hostElement.contains(x.hostElement))
      .map((x) => {
        return {
          id: x.fId(),
          fConnectableSide: x.fConnectableSide,
        };
      });
  }
}
