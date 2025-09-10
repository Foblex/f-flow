import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectorBase, FNodeOutletBase } from '../../../../f-connectors';
import { FNodeBase } from '../../../../f-node';
import { GetFirstConnectableOutputRequest } from './get-first-connectable-output.request';
import { FExecutionRegister } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(GetFirstConnectableOutputRequest)
export class GetFirstConnectableOutputExecution
  implements IHandler<GetFirstConnectableOutputRequest, FConnectorBase | undefined> {

  private readonly _fComponentStore = inject(FComponentsStore);

  private get _fNodes(): FNodeBase[] {
    return this._fComponentStore.fNodes;
  }

  private get _fOutputs(): FConnectorBase[] {
    return this._fComponentStore.fOutputs;
  }

  private _fNode: FNodeBase | undefined;

  public handle(request: GetFirstConnectableOutputRequest): FConnectorBase | undefined {
    if(!this._isValid(request)) {
      return;
    }

    const fOutputs = this._getConnectableOutputs();
    if(!fOutputs.length) {
      throw new Error('The fNode must contain at least one fOutput if there is an fOutlet')
    }

    return fOutputs[0];
  }

  private _isValid(request: GetFirstConnectableOutputRequest): boolean {
    return !!this._getNode(request.fOutlet);
  }

  private _getNode(fOutlet: FNodeOutletBase): FNodeBase {
    this._fNode = this._fNodes.find((x) => x.isContains(fOutlet.hostElement))!;

    return this._fNode;
  }

  private _getConnectableOutputs(): FConnectorBase[] {
    return this._fOutputs
      .filter((x) => this._fNode!.isContains(x.hostElement) && x.canBeConnected);
  }
}
