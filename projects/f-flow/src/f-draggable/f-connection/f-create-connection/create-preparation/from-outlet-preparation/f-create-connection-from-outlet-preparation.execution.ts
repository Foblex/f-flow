import { IHandler } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FCreateConnectionFromOutletPreparationRequest } from './f-create-connection-from-outlet-preparation.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import {
  FConnectorBase,
  FNodeOutletBase,
  FNodeOutputBase,
} from '../../../../../f-connectors';
import { GetFirstConnectableOutputRequest } from '../../get-first-connectable-output';
import { FCreateConnectionDragHandlerPreparationRequest } from '../drag-handler-preparation';
import { FNodeBase } from '../../../../../f-node';

@Injectable()
@FExecutionRegister(FCreateConnectionFromOutletPreparationRequest)
export class FCreateConnectionFromOutletPreparationExecution
  implements IHandler<FCreateConnectionFromOutletPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _store = inject(FComponentsStore);

  public handle(request: FCreateConnectionFromOutletPreparationRequest): void {

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
    const result = this._store.fOutlets
      .find((x) => fNode.isContains(x.hostElement));
    if (!result) {
      throw new Error('Outlet not found');
    }

    return result as FNodeOutletBase;
  }

  private _getNodeOutputs(fNode: FNodeBase): FConnectorBase[] {
    return this._store.fOutputs
      .filter((x) => fNode.isContains(x.hostElement));
  }

  private _createDragHandler(position: IPoint, fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase): void {
    this._fMediator.execute(new FCreateConnectionDragHandlerPreparationRequest(position, fOutputOrOutlet));
  }

  private _getConnectableOutput(fOutlet: FNodeOutletBase): FNodeOutputBase {
    return this._fMediator.execute<FNodeOutputBase>(new GetFirstConnectableOutputRequest(fOutlet));
  }
}
