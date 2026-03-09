import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { RemoveConnectorFromStoreRequest } from './remove-connector-from-store-request';
import { FComponentsStore } from '../../../f-storage';
import { FConnectorBase } from '../../../f-connectors';
import { UnregisterFCacheConnectorRequest } from '../../../f-cache';

/**
 * Execution that removes an inputConnector from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveConnectorFromStoreRequest)
export class RemoveConnectorFromStore implements IExecution<RemoveConnectorFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  public handle({ instance }: RemoveConnectorFromStoreRequest): void {
    switch (instance.kind) {
      case 'input':
        this._removeInput(instance);
        break;
      case 'output':
        this._removeOutput(instance);
        break;
      case 'outlet':
        this._removeOutlet(instance);
        break;
      default:
        throw new Error(`Unknown connector kind: ${instance.kind}`);
    }
  }

  private _removeInput(component: FConnectorBase): void {
    this._store.inputs.removeById(component.fId());
    this._store.emitNodeChanges();

    this._geometryUnregister(component);
  }

  private _removeOutput(component: FConnectorBase): void {
    this._store.outputs.removeById(component.fId());
    this._store.emitNodeChanges();

    this._geometryUnregister(component);
  }

  private _removeOutlet(component: FConnectorBase): void {
    this._store.outlets.removeById(component.fId());
    this._store.emitNodeChanges();

    this._geometryUnregister(component);
  }

  private _geometryUnregister(component: FConnectorBase): void {
    this._mediator.execute(new UnregisterFCacheConnectorRequest(component.fId(), component.kind));
  }
}
