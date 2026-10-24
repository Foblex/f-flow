import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { RegisterPluginInstanceRequest } from './register-plugin-instance-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a line alignment to the FComponentsStore.
 */
@Injectable()
export class RegisterPluginInstance implements IExecution<RegisterPluginInstanceRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ key, instance }: RegisterPluginInstanceRequest): void {
    this._store.instances.add(key, instance);
  }
}
