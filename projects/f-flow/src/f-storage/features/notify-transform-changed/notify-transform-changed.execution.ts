import { NotifyTransformChangedRequest } from './notify-transform-changed.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-components-store';

@Injectable()
@FExecutionRegister(NotifyTransformChangedRequest)
export class NotifyTransformChangedExecution
  implements IExecution<NotifyTransformChangedRequest, void> {

  private _store = inject(FComponentsStore);

  public handle(request: NotifyTransformChangedRequest): void {
    this._store.transformChanged();
  }
}
