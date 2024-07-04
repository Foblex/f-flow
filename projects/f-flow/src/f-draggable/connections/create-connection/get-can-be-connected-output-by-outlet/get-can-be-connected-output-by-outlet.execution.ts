import { IHandler } from '@foblex/core';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectorBase, FNodeOutletBase } from '../../../../f-connectors';
import { FNodeBase } from '../../../../f-node';
import { GetCanBeConnectedOutputByOutletRequest } from './get-can-be-connected-output-by-outlet.request';
import { RequiredOutput } from '../../../../errors';
import { FExecutionRegister } from '../../../../infrastructure';

@Injectable()
@FExecutionRegister(GetCanBeConnectedOutputByOutletRequest)
export class GetCanBeConnectedOutputByOutletExecution
  implements IHandler<GetCanBeConnectedOutputByOutletRequest, FConnectorBase | undefined> {

  private get fNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }

  private get fOutputs(): FConnectorBase[] {
    return this.fComponentsStore.fOutputs;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetCanBeConnectedOutputByOutletRequest): FConnectorBase | undefined {
    const outputs = this.getConnectableOutputs(this.getNode(request.outlet));
    if (!outputs.length) {
      throw RequiredOutput();
    }
    return outputs.length > 0 ? outputs[ 0 ] : undefined;
  }

  private getConnectableOutputs(node: FNodeBase): FConnectorBase[] {
    return this.fOutputs.filter((x) => {
      return node.isContains(x.hostElement) && x.canBeConnected;
    });
  }

  private getNode(outlet: FNodeOutletBase): FNodeBase {
    return this.fNodes.find((x) => x.isContains(outlet.hostElement))!;
  }
}
