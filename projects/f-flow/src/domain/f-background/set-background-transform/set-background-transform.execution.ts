import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { SetBackgroundTransformRequest } from './set-background-transform-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(SetBackgroundTransformRequest)
export class SetBackgroundTransformExecution implements IExecution<SetBackgroundTransformRequest, void> {

  private readonly _fComponentsStore = inject(FComponentsStore);

  public handle(request: SetBackgroundTransformRequest): void {
    this._fComponentsStore.fBackground?.setTransform(request.fTransform);
  }
}
