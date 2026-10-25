import { NotifyTransformChangedRequest } from './notify-transform-changed-request';
import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { FComponentsStore } from '../../f-components-store';

@Injectable()
export class NotifyTransformChanged implements IExecution<NotifyTransformChangedRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(_request: NotifyTransformChangedRequest): void {
    this._store.transformChanged();
  }
}
