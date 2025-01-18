import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveLineAlignmentFromStoreRequest } from './remove-line-alignment-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveLineAlignmentFromStoreRequest)
export class RemoveLineAlignmentFromStoreExecution implements IExecution<RemoveLineAlignmentFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveLineAlignmentFromStoreRequest): void {
    this._fComponentsStore.fLineAlignment = undefined;
  }
}
