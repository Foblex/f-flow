import { IRect } from '@foblex/core';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../infrastructure';
import { GetInputRectInFlowRequest } from './get-input-rect-in-flow-request';
import { FComponentsStore } from '../../f-storage';
import { GetInputRectInFlowResponse } from './get-input-rect-in-flow-response';
import { InputNotFound } from '../../errors';
import { GetElementRectInFlowRequest } from '../get-element-rect-in-flow';

@Injectable()
@FExecutionRegister(GetInputRectInFlowRequest)
export class GetInputRectInFlowExecution implements IExecution<GetInputRectInFlowRequest, GetInputRectInFlowResponse> {

  constructor(
      private fComponentsStore: FComponentsStore,
      private fMediator: FFlowMediator,
  ) {
  }

  public handle(request: GetInputRectInFlowRequest): GetInputRectInFlowResponse {

    const input = this.fComponentsStore.fInputs.find((x) => x.id === request.fInputId);

    if (!input) {
      throw InputNotFound(request.fInputId);
    }

    const result = this.fMediator.send<IRect>(new GetElementRectInFlowRequest(input.hostElement));
    return new GetInputRectInFlowResponse(result, input.fConnectableSide);
  }
}
