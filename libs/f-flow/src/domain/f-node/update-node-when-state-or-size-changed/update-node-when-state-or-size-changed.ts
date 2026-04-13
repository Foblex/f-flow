import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { UpdateNodeWhenStateOrSizeChangedRequest } from './update-node-when-state-or-size-changed-request';
import { EmitConnectionsChangesRequest } from '../../../f-storage';
import { afterNextPaint, FChannelHub, FResizeChannel } from '../../../reactivity';
import { FitToChildNodesAndGroupsRequest } from '../fit-to-child-nodes-and-groups';
import { IsDragStartedRequest } from '../../f-draggable';
import { CalculateConnectorsConnectableSidesRequest } from '../calculate-connectors-connectable-sides';
import { InvalidateFCacheNodeRequest } from '../../../f-cache';

/**
 * Execution that updates a node's connectors when its state or size changes.
 */
@Injectable()
@FExecutionRegister(UpdateNodeWhenStateOrSizeChangedRequest)
export class UpdateNodeWhenStateOrSizeChanged
  implements IExecution<UpdateNodeWhenStateOrSizeChangedRequest, void>
{
  private readonly _mediator = inject(FMediator);

  /**
   * Handles the request to update the node's connectors based on state or size changes.
   * It listens for resize events and recalculates the connectable sides of the connectors.
   * @param request
   */
  public handle({ nodeOrGroup, destroyRef }: UpdateNodeWhenStateOrSizeChangedRequest): void {
    const { hostElement, stateChanges } = nodeOrGroup;

    new FChannelHub(new FResizeChannel(hostElement), stateChanges)
      .pipe(afterNextPaint())
      .listen(destroyRef, () => {
        this._mediator.execute<void>(new EmitConnectionsChangesRequest());

        if (!this._isDragging()) {
          this._mediator.execute(
            new InvalidateFCacheNodeRequest(nodeOrGroup.fId(), 'UpdateNodeWhenStateOrSizeChanged'),
          );

          this._mediator.execute<void>(new CalculateConnectorsConnectableSidesRequest(nodeOrGroup));

          this._mediator.execute<void>(new FitToChildNodesAndGroupsRequest(nodeOrGroup));
        }
      });
  }

  private _isDragging(): boolean {
    return this._mediator.execute(new IsDragStartedRequest());
  }
}
