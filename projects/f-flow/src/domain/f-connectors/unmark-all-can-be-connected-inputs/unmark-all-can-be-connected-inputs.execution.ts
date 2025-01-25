import { UnmarkAllCanBeConnectedInputsRequest } from './unmark-all-can-be-connected-inputs.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';

@Injectable()
@FExecutionRegister(UnmarkAllCanBeConnectedInputsRequest)
export class UnmarkAllCanBeConnectedInputsExecution
  implements IExecution<UnmarkAllCanBeConnectedInputsRequest, void> {

  public handle(payload: UnmarkAllCanBeConnectedInputsRequest): void {
    payload.fInputs.forEach((fInput) => this._unmarkCanBeConnectedTo(fInput));
  }

  private _unmarkCanBeConnectedTo(fInput: FConnectorBase): void {
    fInput.hostElement.classList.remove(F_CSS_CLASS.CONNECTOR.INPUT_CAN_BE_CONNECTED_TO);
  }
}
