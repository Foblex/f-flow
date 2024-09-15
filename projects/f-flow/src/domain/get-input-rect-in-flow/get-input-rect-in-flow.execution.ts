import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetInputRectInFlowRequest } from './get-input-rect-in-flow-request';
import { FComponentsStore } from '../../f-storage';
import { GetInputRectInFlowResponse } from './get-input-rect-in-flow-response';
import { InputNotFound } from '../../errors';
import { GetElementRectInFlowRequest } from '../get-element-rect-in-flow';
import { IRoundedRect } from '@foblex/2d';

@Injectable()
@FExecutionRegister(GetInputRectInFlowRequest)
export class GetInputRectInFlowExecution implements IExecution<GetInputRectInFlowRequest, GetInputRectInFlowResponse> {

  constructor(
      private fComponentsStore: FComponentsStore,
      private fMediator: FMediator,
  ) {
  }

  public handle(request: GetInputRectInFlowRequest): GetInputRectInFlowResponse {

    const input = this.fComponentsStore.fInputs.find((x) => x.id === request.fInputId);

    if (!input) {
      throw InputNotFound(request.fInputId);
    }

    return new GetInputRectInFlowResponse(
      this.fMediator.send<IRoundedRect>(new GetElementRectInFlowRequest(input.hostElement)),
      input.fConnectableSide
    );
  }
}
