import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddLineAlignmentToStoreRequest } from './add-line-alignment-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddLineAlignmentToStoreRequest)
export class AddLineAlignmentToStoreExecution implements IExecution<AddLineAlignmentToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddLineAlignmentToStoreRequest): void {
    //this._fComponentsStore.fFlow = request.fComponent;
  }
}
