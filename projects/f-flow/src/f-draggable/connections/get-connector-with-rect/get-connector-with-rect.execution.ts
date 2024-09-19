import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetConnectorWithRectRequest } from './get-connector-with-rect-request';
import { IRoundedRect } from '@foblex/2d';
import { GetElementRectInFlowRequest, IConnectorWithRect } from '@foblex/flow';

@Injectable()
@FExecutionRegister(GetConnectorWithRectRequest)
export class GetConnectorWithRectExecution implements IExecution<GetConnectorWithRectRequest, IConnectorWithRect> {

  constructor(
      private fMediator: FMediator,
  ) {
  }

  public handle(request: GetConnectorWithRectRequest): IConnectorWithRect {
    //
    // // let output = this.fComponentsStore.fOutputs.find((x) => x.id === request.fOutputId);
    // //
    // // if (!output) {
    // //   output = this.fComponentsStore.fOutlets.find((x) => x.id === request.fOutputId);
    // // }
    // //
    // // if (!output) {
    // //   throw OutputNotFound(request.fOutputId);
    // // }
    //
    // const result = this.fMediator.send<IRoundedRect>(new GetElementRectInFlowRequest(request.connector.hostElement));
    return {
      fConnector: request.connector,
      fRect: this.fMediator.send<IRoundedRect>(new GetElementRectInFlowRequest(request.connector.hostElement))
    }
  }
}
