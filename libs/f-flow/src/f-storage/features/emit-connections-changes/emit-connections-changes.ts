import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { EmitConnectionsChangesRequest } from './emit-connections-changes-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
export class EmitConnectionsChanges implements IExecution<EmitConnectionsChangesRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ dirtyNodeId }: EmitConnectionsChangesRequest): void {
    this._store.emitConnectionChanges(dirtyNodeId);
  }
}
