import { MarkAllCanBeConnectedInputsRequest } from './mark-all-can-be-connected-inputs.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(MarkAllCanBeConnectedInputsRequest)
export class MarkAllCanBeConnectedInputsExecution
  implements IExecution<MarkAllCanBeConnectedInputsRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(payload: MarkAllCanBeConnectedInputsRequest): void {
    this._fComponentsStore.flowHost.classList.add(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    payload.fInputs.forEach((fInput) => this._markCanBeConnectedTo(fInput));
  }

  private _markCanBeConnectedTo(fInput: FConnectorBase): void {
    fInput.hostElement.classList.add(F_CSS_CLASS.CONNECTOR.INPUT_CAN_BE_CONNECTED_TO);
  }
}
