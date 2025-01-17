import { IHandler } from '@foblex/mediator';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectorBase, isNodeOutlet, isNodeOutput } from '../../../../f-connectors';
import { FNodeBase } from '../../../../f-node';
import { CreateConnectionPreparationRequest } from './create-connection-preparation.request';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { CreateConnectionFromOutletPreparationRequest } from './create-connection-from-outlet-preparation';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection-from-output-preparation';
import { FDraggableDataContext } from '../../../f-draggable-data-context';

@Injectable()
@FExecutionRegister(CreateConnectionPreparationRequest)
export class CreateConnectionPreparationExecution
  implements IHandler<CreateConnectionPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: CreateConnectionPreparationRequest): void {
    if (!this._isValid(request)) {
      return;
    }

    if (isNodeOutlet(request.event.targetElement)) {
      this._fMediator.send<void>(new CreateConnectionFromOutletPreparationRequest(request.event));
    } else if (this.isNodeOutput(request.event.targetElement, this._getNode(request.event)!)) {
      this._fMediator.send<void>(new CreateConnectionFromOutputPreparationRequest(request.event));
    }
  }

  private _isValid(request: CreateConnectionPreparationRequest): boolean {
    return !!this._getNode(request.event) && this._isValidConditions();
  }

  private _getNode(event: IPointerEvent): FNodeBase | undefined {
    return this._fComponentsStore
      .fNodes.find(n => n.isContains(event.targetElement));
  }

  private _isValidConditions(): boolean {
    return !this._fDraggableDataContext.draggableItems.length && !!this._fComponentsStore.fTempConnection;
  }

  private isNodeOutput(targetElement: HTMLElement, node: FNodeBase): boolean {
    return isNodeOutput(targetElement) && !this.getOutlets(node).length;
  }

  private getOutlets(node: FNodeBase): FConnectorBase[] {
    return this._fComponentsStore.fOutlets.filter((x) => node.isContains(x.hostElement));
  }
}
