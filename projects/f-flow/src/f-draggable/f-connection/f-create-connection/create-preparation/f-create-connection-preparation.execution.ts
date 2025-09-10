import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { isNodeOutlet, isNodeOutput } from '../../../../f-connectors';
import { FNodeBase } from '../../../../f-node';
import { FCreateConnectionPreparationRequest } from './f-create-connection-preparation.request';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FCreateConnectionFromOutletPreparationRequest } from './from-outlet-preparation';
import { FCreateConnectionFromOutputPreparationRequest } from './from-output-preparation';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FReassignConnectionPreparationRequest } from '../../f-reassign-connection';
import { isValidEventTrigger } from '../../../../domain';
import { IPointerEvent } from "../../../../drag-toolkit";

@Injectable()
@FExecutionRegister(FCreateConnectionPreparationRequest)
export class FCreateConnectionPreparationExecution
  implements IHandler<FCreateConnectionPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _store = inject(FComponentsStore);
  private _dragContext = inject(FDraggableDataContext);

  private _fNode: FNodeBase | undefined;

  public handle(request: FCreateConnectionPreparationRequest): void {
    if (!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }

    if (isNodeOutlet(request.event.targetElement)) {
      this._fMediator.execute<void>(
        new FCreateConnectionFromOutletPreparationRequest(request.event, this._fNode!),
      );
    } else if (isNodeOutput(request.event.targetElement)) {
      this._fMediator.execute<void>(
        new FCreateConnectionFromOutputPreparationRequest(request.event, this._fNode!),
      );
    }
  }

  private _isValid(request: FCreateConnectionPreparationRequest): boolean {
    return !!this._getNode(request.event) && this._isValidConditions();
  }

  private _getNode(event: IPointerEvent): FNodeBase | undefined {
    this._fNode = this._store
      .fNodes.find(n => n.isContains(event.targetElement));

    return this._fNode;
  }

  private _isValidConditions(): boolean {
    return this._dragContext.isEmpty() && !!this._store.fTempConnection;
  }

  private _isValidTrigger(request: FReassignConnectionPreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }
}
