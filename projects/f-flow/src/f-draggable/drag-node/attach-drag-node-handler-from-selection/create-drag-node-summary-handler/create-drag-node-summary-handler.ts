import { inject, Injectable, Injector } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateDragNodeSummaryHandlerRequest } from './create-drag-node-summary-handler-request';
import { DragNodeHandler } from '../../drag-node-handler';
import { DragNodeItemHandler } from '../../drag-node-item-handler';
import { FNodeBase } from '../../../../f-node';
import { BuildDragNodeConstraintsRequest } from '../build-drag-node-constraints';
import { IDragNodeDeltaConstraints } from '../../drag-node-constraint';

@Injectable()
@FExecutionRegister(CreateDragNodeSummaryHandlerRequest)
export class CreateDragNodeSummaryHandler
  implements IExecution<CreateDragNodeSummaryHandlerRequest, DragNodeHandler>
{
  private readonly _injector = inject(Injector);
  private readonly _mediator = inject(FMediator);

  public handle({
    rootHandlers,
    participants,
  }: CreateDragNodeSummaryHandlerRequest): DragNodeHandler {
    this._applyLimitsToRoots(rootHandlers);

    return new DragNodeHandler(this._injector, participants, rootHandlers);
  }

  private _applyLimitsToRoots(roots: DragNodeItemHandler[]): void {
    for (const handler of roots) {
      handler.setLimits(this._calculateLimits(handler.nodeOrGroup));
    }
  }

  private _calculateLimits(nodeOrGroup: FNodeBase): IDragNodeDeltaConstraints {
    return this._mediator.execute<IDragNodeDeltaConstraints>(
      new BuildDragNodeConstraintsRequest(nodeOrGroup),
    );
  }
}
