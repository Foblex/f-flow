import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ListenNodesChangesRequest } from './listen-nodes-changes-request';
import { FComponentsStore } from '../../../f-storage';
import { FChannelHub } from '../../../reactivity';

@Injectable()
@FExecutionRegister(ListenNodesChangesRequest)
export class ListenNodesChanges implements IExecution<ListenNodesChangesRequest, FChannelHub> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: ListenNodesChangesRequest): FChannelHub {
    return new FChannelHub(this._store.nodesChanges$);
  }
}
