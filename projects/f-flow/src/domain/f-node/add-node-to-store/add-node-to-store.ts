import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddNodeToStoreRequest } from './add-node-to-store-request';
import { FComponentsStore } from '../../../f-storage';
import { FGeometryCache } from '../../geometry-cache';

/**
 * Execution that adds a Node to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddNodeToStoreRequest)
export class AddNodeToStore implements IExecution<AddNodeToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _geometryCache = inject(FGeometryCache);

  public handle({ nodeOrGroup }: AddNodeToStoreRequest): void {
    this._store.nodes.add(nodeOrGroup);
    this._geometryCache.registerNode(nodeOrGroup.fId(), nodeOrGroup.hostElement, nodeOrGroup);
    this._store.countChanged();
  }
}
