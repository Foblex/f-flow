import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IsDragStartedRequest } from './is-drag-started-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that checks if a drag operation has started.
 */
@Injectable()
@FExecutionRegister(IsDragStartedRequest)
export class IsDragStarted implements IExecution<IsDragStartedRequest, boolean> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: IsDragStartedRequest): boolean {
    return !!this._store.fDraggable?.isDragStarted;
  }
}
