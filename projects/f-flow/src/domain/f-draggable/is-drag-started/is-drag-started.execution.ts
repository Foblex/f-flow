import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IsDragStartedRequest } from './is-drag-started-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(IsDragStartedRequest)
export class IsDragStartedExecution implements IExecution<IsDragStartedRequest, boolean> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: IsDragStartedRequest): boolean {
    return !!this._fComponentsStore.fDraggable?.isDragStarted;
  }
}
