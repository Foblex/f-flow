import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RegisterPluginInstanceRequest } from './register-plugin-instance-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a line alignment to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RegisterPluginInstanceRequest)
export class RegisterPluginInstance implements IExecution<RegisterPluginInstanceRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ key, instance }: RegisterPluginInstanceRequest): void {
    this._store.instances.add(key, instance);
  }
}
