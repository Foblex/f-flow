import { TransformChangedRequest } from './transform-changed.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-components-store';

@Injectable()
@FExecutionRegister(TransformChangedRequest)
export class TransformChangedExecution
  implements IExecution<TransformChangedRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: TransformChangedRequest): void {
    this._fComponentsStore.transformChanged();
  }
}
