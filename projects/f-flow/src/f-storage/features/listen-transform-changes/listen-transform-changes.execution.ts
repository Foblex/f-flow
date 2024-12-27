import { ListenTransformChangesRequest } from './listen-transform-changes.request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../index';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FChannelHub } from '../../../reactive';

@Injectable()
@FExecutionRegister(ListenTransformChangesRequest)
export class ListenTransformChangesExecution
  implements IExecution<ListenTransformChangesRequest, FChannelHub> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: ListenTransformChangesRequest): FChannelHub {
    return new FChannelHub(
      this._fComponentsStore.transformChanges
    );
    //
    //   [
    //   this._fComponentsStore.transformChanges,
    //   // toSignal(this._fComponentsStore.componentsData$),
    //   // toSignal(this._fComponentsStore.componentsCount$)
    // ]);
  }
}
