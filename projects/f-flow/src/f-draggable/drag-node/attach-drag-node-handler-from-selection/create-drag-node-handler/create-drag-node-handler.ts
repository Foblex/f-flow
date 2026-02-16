import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateDragNodeHandlerRequest } from './create-drag-node-handler-request';
import { DragNodeHandler, DragNodeItemHandler } from '../../drag-node-handler';
import { FNodeBase } from '../../../../f-node';
import { BuildDragNodeConstraintsRequest } from '../build-drag-node-constraints';
import { IDragNodeDeltaConstraints } from '../../drag-node-constraint';
import { DragHandlerInjector } from '../../../infrastructure';

@Injectable()
@FExecutionRegister(CreateDragNodeHandlerRequest)
export class CreateDragNodeHandler
  implements IExecution<CreateDragNodeHandlerRequest, DragNodeHandler>
{
  private readonly _dragInjector = inject(DragHandlerInjector);
  private readonly _mediator = inject(FMediator);

  public handle({ rootHandlers, participants }: CreateDragNodeHandlerRequest): DragNodeHandler {
    this._applyConstraintsToRoots(rootHandlers);
    const handler = this._dragInjector.createInstance(DragNodeHandler);
    handler.initialize(participants, rootHandlers);

    return handler;
  }

  private _applyConstraintsToRoots(roots: DragNodeItemHandler[]): void {
    for (const handler of roots) {
      handler.setConstraints(this._calculateConstraints(handler.nodeOrGroup));
    }
  }

  private _calculateConstraints(nodeOrGroup: FNodeBase): IDragNodeDeltaConstraints {
    return this._mediator.execute<IDragNodeDeltaConstraints>(
      new BuildDragNodeConstraintsRequest(nodeOrGroup),
    );
  }
}
