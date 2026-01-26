import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { NotifyDataChangedRequest } from './notify-data-changed-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(NotifyDataChangedRequest)
export class NotifyDataChanged implements IExecution<NotifyDataChangedRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(_request: NotifyDataChangedRequest): void {
    this._store.dataChanged();
  }
}
