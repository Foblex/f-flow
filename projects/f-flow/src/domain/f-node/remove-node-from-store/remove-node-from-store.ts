import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveNodeFromStoreRequest } from './remove-node-from-store-request';
import { FComponentsStore } from '../../../f-storage';
import { FGeometryCache } from '../../geometry-cache';

/**
 * Execution that removes a node from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveNodeFromStoreRequest)
export class RemoveNodeFromStore implements IExecution<RemoveNodeFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _geometryCache = inject(FGeometryCache);

  public handle({ instance }: RemoveNodeFromStoreRequest): void {
    this._store.nodes.remove(instance);
    this._geometryCache.unregisterNode(instance.fId());
    this._store.countChanged();
  }
}
