import { MarkAllCanBeConnectedInputsRequest } from './mark-all-can-be-connected-inputs.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';

@Injectable()
@FExecutionRegister(MarkAllCanBeConnectedInputsRequest)
export class MarkAllCanBeConnectedInputsExecution
  implements IExecution<MarkAllCanBeConnectedInputsRequest, void> {

  public handle(payload: MarkAllCanBeConnectedInputsRequest): void {
    payload.fInputs.forEach((fInput) => this._markCanBeConnectedTo(fInput));
  }

  private _markCanBeConnectedTo(fInput: FConnectorBase): void {
    fInput.hostElement.classList.add(F_CSS_CLASS.CONNECTOR.INPUT_CAN_BE_CONNECTED_TO);
  }
}
