import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { isNodeOutlet, isNodeOutput } from '../../../../f-connectors';
import { FNodeBase } from '../../../../f-node';
import { CreateConnectionPreparationRequest } from './create-connection-preparation-request';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FCreateConnectionFromOutletPreparationRequest } from './from-outlet-preparation';
import { CreateConnectionFromOutputPreparationRequest } from './from-output-preparation';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FReassignConnectionPreparationRequest } from '../../f-reassign-connection';
import { isValidEventTrigger } from '../../../../domain';
import { IPointerEvent } from '../../../../drag-toolkit';

@Injectable()
@FExecutionRegister(CreateConnectionPreparationRequest)
export class CreateConnectionPreparation
  implements IHandler<CreateConnectionPreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private _node: FNodeBase | undefined;

  public handle(request: CreateConnectionPreparationRequest): void {
    if (!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }

    if (isNodeOutlet(request.event.targetElement)) {
      this._mediator.execute<void>(
        new FCreateConnectionFromOutletPreparationRequest(request.event, this._node!),
      );
    } else if (isNodeOutput(request.event.targetElement)) {
      this._mediator.execute<void>(
        new CreateConnectionFromOutputPreparationRequest(request.event, this._node!),
      );
    }
  }

  private _isValid(request: CreateConnectionPreparationRequest): boolean {
    return !!this._getNode(request.event) && this._isValidConditions();
  }

  private _getNode(event: IPointerEvent): FNodeBase | undefined {
    this._node = this._store.nodes.getAll<FNodeBase>().find((n) => n.isContains(event.targetElement));

    return this._node;
  }

  private _isValidConditions(): boolean {
    return this._dragContext.isEmpty() && !!this._store.connections.getForSnap();
  }

  private _isValidTrigger(request: FReassignConnectionPreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }
}
