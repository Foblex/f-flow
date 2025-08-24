import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { NotifyDataChangedRequest } from './notify-data-changed-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(NotifyDataChangedRequest)
export class NotifyDataChangedExecution implements IExecution<NotifyDataChangedRequest, void> {

  private _store = inject(FComponentsStore);

  public handle(request: NotifyDataChangedRequest): void {
    this._store.dataChanged();
  }
}
