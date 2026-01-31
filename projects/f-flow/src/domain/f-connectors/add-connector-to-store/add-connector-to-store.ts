import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddConnectorToStoreRequest } from './add-connector-to-store-request';
import { FComponentsStore } from '../../../f-storage';
import { FConnectorBase, FNodeInputBase, FNodeOutputBase } from '../../../f-connectors';

/**
 * Execution that adds an InputConnector to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddConnectorToStoreRequest)
export class AddConnectorToStore implements IExecution<AddConnectorToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ instance }: AddConnectorToStoreRequest): void {
    switch (instance.kind) {
      case 'input':
        this._addInput(instance);
        break;
      case 'output':
        this._addOutput(instance);
        break;
      case 'outlet':
        this._addOutlet(instance);
        break;
      default:
        throw new Error(`Unknown connector kind: ${instance.kind}`);
    }
  }

  private _addInput(component: FConnectorBase): void {
    this._store.inputs.add(component as FNodeInputBase);
    this._store.countChanged();
  }

  private _addOutput(component: FConnectorBase): void {
    this._store.outputs.add(component as FNodeOutputBase);
    this._store.countChanged();
  }

  private _addOutlet(component: FConnectorBase): void {
    this._store.addComponent(this._store.fOutlets, component);
  }
}
