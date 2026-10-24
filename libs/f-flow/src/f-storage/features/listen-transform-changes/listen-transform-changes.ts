import { ListenTransformChangesRequest } from './listen-transform-changes-request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../index';
import { IExecution } from '../../../_libs/f-mediator';
import { FChannelHub } from '../../../reactivity';

@Injectable()
export class ListenTransformChanges implements IExecution<
  ListenTransformChangesRequest,
  FChannelHub
> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: ListenTransformChangesRequest): FChannelHub {
    return new FChannelHub(
      this._store.transformChanges$,
      this._store.connectionsChanges$,
      this._store.nodesChanges$,
    );
  }
}
