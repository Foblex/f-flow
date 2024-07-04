import { Injectable } from '@angular/core';
import { GetCanBeConnectedOutputByOutletRequest } from './get-can-be-connected-output-by-outlet.request';
import { FValidatorRegister, IValidator } from '../../../../infrastructure';
import { FNodeBase } from '../../../../f-node';
import { FComponentsStore } from '../../../../f-storage';

@Injectable()
@FValidatorRegister(GetCanBeConnectedOutputByOutletRequest)
export class GetCanBeConnectedOutputByOutletValidator implements IValidator<GetCanBeConnectedOutputByOutletRequest> {

  private get fNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetCanBeConnectedOutputByOutletRequest): boolean {
    return !!this.fNodes.find((x) => x.isContains(request.outlet.hostElement));
  }
}
