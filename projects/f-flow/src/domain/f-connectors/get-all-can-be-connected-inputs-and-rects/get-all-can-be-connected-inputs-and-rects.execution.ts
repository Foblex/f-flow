import { GetAllCanBeConnectedInputsAndRectsRequest } from './get-all-can-be-connected-inputs-and-rects.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectorBase, FNodeOutletDirective, FNodeOutputDirective } from '../../../f-connectors';
import { FComponentsStore } from '../../../f-storage';
import { IConnectorAndRect } from '../i-connector-and-rect';
import { GetConnectorAndRectRequest } from '../get-connector-and-rect';

@Injectable()
@FExecutionRegister(GetAllCanBeConnectedInputsAndRectsRequest)
export class GetAllCanBeConnectedInputsAndRectsExecution
  implements IExecution<GetAllCanBeConnectedInputsAndRectsRequest, IConnectorAndRect[]> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);

  private get _fInputs(): FConnectorBase[] {
    return this._fComponentsStore.fInputs;
  }

  public handle(payload: GetAllCanBeConnectedInputsAndRectsRequest): IConnectorAndRect[] {
    return this._getCanBeConnectedInputs(payload.fOutput).map((x) => {
      return this._fMediator.execute(new GetConnectorAndRectRequest(x));
    });
  }

  private _getCanBeConnectedInputs(fOutput: FNodeOutputDirective | FNodeOutletDirective): FConnectorBase[] {
    let fInputs: FConnectorBase[] = [];
    if (fOutput.canBeConnectedInputs?.length) {
      fInputs = this._fInputs.filter((x) => fOutput.canBeConnectedInputs.includes(x.fId));
    } else {
      fInputs = this._fInputs.filter((x) => x.canBeConnected);

      if(!fOutput.isSelfConnectable) {
        fInputs = this._filterSelfConnectable(fInputs, fOutput);
      }
    }
    return fInputs;
  }

  private _filterSelfConnectable(fInputs: FConnectorBase[], fOutput: FConnectorBase): FConnectorBase[] {
    return fInputs.filter((x) => fOutput.fNodeId !== x.fNodeId);
  }
}
