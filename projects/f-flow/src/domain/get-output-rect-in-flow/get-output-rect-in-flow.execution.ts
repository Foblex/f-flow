import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetOutputRectInFlowRequest } from './get-output-rect-in-flow-request';
import { FComponentsStore } from '../../f-storage';
import { GetOutputRectInFlowResponse } from './get-output-rect-in-flow-response';
import { OutputNotFound } from '../../errors';
import { GetElementRectInFlowRequest } from '../get-element-rect-in-flow';
import { IRoundedRect } from '@foblex/2d';

@Injectable()
@FExecutionRegister(GetOutputRectInFlowRequest)
export class GetOutputRectInFlowExecution implements IExecution<GetOutputRectInFlowRequest, GetOutputRectInFlowResponse> {

  constructor(
      private fComponentsStore: FComponentsStore,
      private fMediator: FMediator,
  ) {
  }

  public handle(request: GetOutputRectInFlowRequest): GetOutputRectInFlowResponse {

    let output = this.fComponentsStore.fOutputs.find((x) => x.id === request.fOutputId);

    if (!output) {
      output = this.fComponentsStore.fOutlets.find((x) => x.id === request.fOutputId);
    }

    if (!output) {
      throw OutputNotFound(request.fOutputId);
    }

    const result = this.fMediator.send<IRoundedRect>(new GetElementRectInFlowRequest(output.hostElement));
    return new GetOutputRectInFlowResponse(result, output.fConnectableSide);
  }
}
