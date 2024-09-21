import { GetAllCanBeConnectedInputPositionsRequest } from './get-all-can-be-connected-input-positions.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetConnectorWithRectRequest, IConnectorWithRect } from '../get-connector-with-rect';
import { FNodeBase } from '../../../f-node';
import { FConnectorBase } from '../../../f-connectors';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(GetAllCanBeConnectedInputPositionsRequest)
export class GetAllCanBeConnectedInputPositionsExecution
  implements IExecution<GetAllCanBeConnectedInputPositionsRequest, IConnectorWithRect[]> {

  private get fNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }

  private get fInputs(): FConnectorBase[] {
    return this.fComponentsStore.fInputs;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator
  ) {
  }

  public handle(payload: GetAllCanBeConnectedInputPositionsRequest): IConnectorWithRect[] {
    return this.getCanBeConnectedInputs(this.getOutput(payload.fOutputId)!).map((x) => {
      return this.fMediator.send(new GetConnectorWithRectRequest(x));
    });
  }

  private getOutput(fId: string): FConnectorBase | undefined {
    return this.findOutputById(fId) || this.findOutletById(fId);
  }

  private findOutputById(fId: string): FConnectorBase | undefined {
    return this.fComponentsStore.fOutputs.find((x) => x.id === fId);
  }

  private findOutletById(fId: string): FConnectorBase | undefined {
    return this.fComponentsStore.fOutlets.find((x) => x.id === fId);
  }

  private getCanBeConnectedInputs(output: FConnectorBase): FConnectorBase[] {
    return output.isSelfConnectable ?
      this.fInputs.filter((x) => x.canBeConnected) :
      this.filterSelfConnectable(this.fInputs.filter((x) => x.canBeConnected), output);
  }

  private filterSelfConnectable(inputs: FConnectorBase[], output: FConnectorBase): FConnectorBase[] {
    return inputs.filter((x) => this.getNodeOfConnector(output)?.hostElement !== this.getNodeOfConnector(x)?.hostElement);
  }

  private getNodeOfConnector(connector: FConnectorBase): FNodeBase | undefined {
    return this.fNodes.find((x) => x.isContains(connector.hostElement));
  }
}
