import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { EmitConnectionsChangesRequest } from './emit-connections-changes-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(EmitConnectionsChangesRequest)
export class EmitConnectionsChanges implements IExecution<EmitConnectionsChangesRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: EmitConnectionsChangesRequest): void {
    this._store.emitConnectionChanges();
  }
}
