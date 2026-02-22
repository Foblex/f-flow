import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateDragNodeHandlerRequest } from './create-drag-node-handler-request';
import { DragNodeHandler, DragNodeItemHandler } from '../../drag-node-handler';
import { FNodeBase } from '../../../../f-node';
import { BuildDragNodeConstraintsRequest } from '../build-drag-node-constraints';
import { IDragNodeDeltaConstraints } from '../../drag-node-constraint';
import { DragHandlerInjector } from '../../../infrastructure';
import { DragNodeConnectionHandlerBase } from '../../drag-node-dependent-connection-handlers';
import { AttachSoftParentConnectionDragHandlersToNodeRequest } from '../attach-soft-parent-connection-drag-handlers-to-node';

@Injectable()
@FExecutionRegister(CreateDragNodeHandlerRequest)
export class CreateDragNodeHandler implements IExecution<
  CreateDragNodeHandlerRequest,
  DragNodeHandler
> {
  private readonly _dragInjector = inject(DragHandlerInjector);
  private readonly _mediator = inject(FMediator);

  public handle({ rootHandlers, participants }: CreateDragNodeHandlerRequest): DragNodeHandler {
    const handlerPool = this._collectConnectionHandlers(participants);
    this._applyConstraintsToRoots(rootHandlers, handlerPool);

    const handler = this._dragInjector.createInstance(DragNodeHandler);
    handler.initialize(participants, rootHandlers);

    return handler;
  }

  private _applyConstraintsToRoots(
    roots: DragNodeItemHandler[],
    handlerPool: DragNodeConnectionHandlerBase[],
  ): void {
    for (const handler of roots) {
      const constraints = this._calculateConstraints(handler.nodeOrGroup);
      handler.setConstraints(constraints);
      this._attachSoftParentConnectionHandlers(handler, constraints, handlerPool);
    }
  }

  private _collectConnectionHandlers(
    participants: DragNodeItemHandler[],
  ): DragNodeConnectionHandlerBase[] {
    const result = new Map<string, DragNodeConnectionHandlerBase>();

    for (const participant of participants) {
      for (const handler of participant.sourceConnectionHandlers) {
        result.set(handler.connection.fId(), handler);
      }
      for (const handler of participant.targetConnectionHandlers) {
        result.set(handler.connection.fId(), handler);
      }
    }

    return Array.from(result.values());
  }

  private _attachSoftParentConnectionHandlers(
    dragHandler: DragNodeItemHandler,
    constraints: IDragNodeDeltaConstraints,
    handlerPool: DragNodeConnectionHandlerBase[],
  ): void {
    this._mediator.execute<void>(
      new AttachSoftParentConnectionDragHandlersToNodeRequest(
        dragHandler,
        constraints,
        handlerPool,
      ),
    );
  }

  private _calculateConstraints(nodeOrGroup: FNodeBase): IDragNodeDeltaConstraints {
    return this._mediator.execute<IDragNodeDeltaConstraints>(
      new BuildDragNodeConstraintsRequest(nodeOrGroup),
    );
  }
}
