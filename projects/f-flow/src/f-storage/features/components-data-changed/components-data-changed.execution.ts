import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ComponentsDataChangedRequest } from './components-data-changed-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(ComponentsDataChangedRequest)
export class ComponentsDataChangedExecution implements IExecution<ComponentsDataChangedRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: ComponentsDataChangedRequest): void {
    this._fComponentsStore.componentDataChanged();
  }
}
