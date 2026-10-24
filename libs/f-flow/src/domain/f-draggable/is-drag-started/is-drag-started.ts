import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { IsDragStartedRequest } from './is-drag-started-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that checks if a drag operation has started.
 */
@Injectable()
export class IsDragStarted implements IExecution<IsDragStartedRequest, boolean> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: IsDragStartedRequest): boolean {
    return !!this._store.fDraggable?.isDragStarted;
  }
}
