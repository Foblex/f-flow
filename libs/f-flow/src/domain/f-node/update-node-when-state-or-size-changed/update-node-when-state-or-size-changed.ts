import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { UpdateNodeWhenStateOrSizeChangedRequest } from './update-node-when-state-or-size-changed-request';
import { EmitConnectionsChangesRequest } from '../../../f-storage';
import { FChannelHub, FResizeChannel } from '../../../reactivity';
import { FitToChildNodesAndGroupsRequest } from '../fit-to-child-nodes-and-groups';
import { IsDragStartedRequest } from '../../f-draggable';
import { CalculateConnectorsConnectableSidesRequest } from '../calculate-connectors-connectable-sides';
import { InvalidateFCacheNodeRequest } from '../../../f-cache';
import { FReflowOrchestrator } from '../../../plugins/layout/f-reflow-on-resize';

/**
 * Execution that updates a node's connectors when its state or size changes.
 *
 * Content-driven resize path for the reflow-on-resize feature — after the
 * existing downstream updates (connector sides + fit-to-children), the
 * orchestrator is invoked. It consults its own baseline tracker (not the
 * global cache, which is disabled by default) and short-circuits when the
 * feature is not active.
 */
@Injectable()
@FExecutionRegister(UpdateNodeWhenStateOrSizeChangedRequest)
export class UpdateNodeWhenStateOrSizeChanged implements IExecution<
  UpdateNodeWhenStateOrSizeChangedRequest,
  void
> {
  private readonly _mediator = inject(FMediator);
  private readonly _reflowOrchestrator = inject(FReflowOrchestrator);

  /**
   * Handles the request to update the node's connectors based on state or size changes.
   * It listens for resize events and recalculates the connectable sides of the connectors.
   * @param request
   */
  public handle({ nodeOrGroup, destroyRef }: UpdateNodeWhenStateOrSizeChangedRequest): void {
    const { hostElement, stateChanges } = nodeOrGroup;

    new FChannelHub(new FResizeChannel(hostElement), stateChanges)
      // .pipe(afterNextPaint()) // Removed: caused ~32ms lag on resize/toggle. Debounce is sufficient for DOM stability.
      .listen(destroyRef, () => {
        this._mediator.execute<void>(new EmitConnectionsChangesRequest());
        if (!this._isDragging()) {
          this._mediator.execute(
            new InvalidateFCacheNodeRequest(nodeOrGroup.fId(), 'UpdateNodeWhenStateOrSizeChanged'),
          );

          this._mediator.execute<void>(new CalculateConnectorsConnectableSidesRequest(nodeOrGroup));

          this._mediator.execute<void>(new FitToChildNodesAndGroupsRequest(nodeOrGroup));

          this._reflowOrchestrator.handleResize(nodeOrGroup);
        }
      });
  }

  private _isDragging(): boolean {
    return this._mediator.execute(new IsDragStartedRequest());
  }
}
