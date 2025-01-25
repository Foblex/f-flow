import { UnmarkAllCanBeConnectedInputsRequest } from './unmark-all-can-be-connected-inputs.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(UnmarkAllCanBeConnectedInputsRequest)
export class UnmarkAllCanBeConnectedInputsExecution
  implements IExecution<UnmarkAllCanBeConnectedInputsRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(payload: UnmarkAllCanBeConnectedInputsRequest): void {
    this._fComponentsStore.flowHost.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    payload.fInputs.forEach((fInput) => this._unmarkCanBeConnectedTo(fInput));
  }

  private _unmarkCanBeConnectedTo(fInput: FConnectorBase): void {
    fInput.hostElement.classList.remove(F_CSS_CLASS.CONNECTOR.INPUT_CAN_BE_CONNECTED_TO);
  }
}
