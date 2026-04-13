import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemovePluginInstanceRequest } from './remove-plugin-instance-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes a line alignment from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemovePluginInstanceRequest)
export class RemovePluginInstance implements IExecution<RemovePluginInstanceRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ key }: RemovePluginInstanceRequest): void {
    this._store.instances.remove(key);
  }
}
