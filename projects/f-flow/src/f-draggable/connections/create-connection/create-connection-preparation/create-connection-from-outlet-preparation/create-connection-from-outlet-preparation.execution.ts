import { IHandler } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { CreateConnectionFromOutletPreparationRequest } from './create-connection-from-outlet-preparation.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import {
  FConnectorBase,
  FNodeOutletBase,
  FNodeOutputBase,
} from '../../../../../f-connectors';
import { GetCanBeConnectedOutputByOutletRequest } from '../../get-can-be-connected-output-by-outlet';
import { CreateConnectionDragHandlerPreparationRequest } from '../create-connection-drag-handler-preparation';
import { FNodeBase } from '../../../../../f-node';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutletPreparationRequest)
export class CreateConnectionFromOutletPreparationExecution
  implements IHandler<CreateConnectionFromOutletPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: CreateConnectionFromOutletPreparationRequest): void {

    const fOutlet = this._getNodeOutlet(request.fNode);
    const fOutputs = this._getNodeOutputs(request.fNode);

    fOutlet.setOutputs(fOutputs);

    if (!fOutlet.canBeConnected) {
      return;
    }

    if (fOutlet.isConnectionFromOutlet) {
      this._createDragHandler(request.event.getPosition(), fOutlet);
    } else {
      this._createDragHandler(request.event.getPosition(), this._getConnectableOutput(fOutlet));
    }
  }

  private _getNodeOutlet(fNode: FNodeBase): FNodeOutletBase {
    const result = this._fComponentsStore.fOutlets
      .find((x) => fNode.isContains(x.hostElement));
    if (!result) {
      throw new Error('Outlet not found');
    }
    return result as FNodeOutletBase;
  }

  private _getNodeOutputs(fNode: FNodeBase): FConnectorBase[] {
    return this._fComponentsStore.fOutputs
      .filter((x) => fNode.isContains(x.hostElement));
  }

  private _createDragHandler(position: IPoint, fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase): void {
    this._fMediator.execute(new CreateConnectionDragHandlerPreparationRequest(position, fOutputOrOutlet));
  }

  private _getConnectableOutput(fOutlet: FNodeOutletBase): FNodeOutputBase {
    return this._fMediator.execute<FNodeOutputBase>(new GetCanBeConnectedOutputByOutletRequest(fOutlet));
  }
}
