import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { UpdateNodeWhenStateOrSizeChangedRequest } from './update-node-when-state-or-size-changed-request';
import { NotifyDataChangedRequest } from '../../../f-storage';
import { debounceTime, FChannelHub, notifyOnStart } from '../../../reactivity';
import { FResizeChannel } from '../../../reactivity';
import { FitToChildNodesAndGroupsRequest } from '../fit-to-child-nodes-and-groups';
import { IsDragStartedRequest } from '../../f-draggable';
import { CalculateNodeConnectorsConnectableSidesRequest } from '../calculate-node-connectors-connectable-sides';

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
      .pipe(notifyOnStart(), debounceTime(10))
      .listen(destroyRef, () => {
        this._mediator.execute<void>(new NotifyDataChangedRequest());

        if (!this._isDragging()) {
          this._mediator.execute<void>(
            new CalculateNodeConnectorsConnectableSidesRequest(nodeOrGroup),
          );

          this._mediator.execute<void>(new FitToChildNodesAndGroupsRequest(nodeOrGroup));
        }
      });
  }

  private _isDragging(): boolean {
    return this._mediator.execute(new IsDragStartedRequest());
  }
}
