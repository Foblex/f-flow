import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ComponentDataChangedRequest } from './component-data-changed-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(ComponentDataChangedRequest)
export class ComponentDataChangedExecution implements IExecution<ComponentDataChangedRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: ComponentDataChangedRequest): void {
    this._fComponentsStore.dataChanged();
  }
}
