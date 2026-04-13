import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { NotifyNodesRenderedRequest } from './notify-nodes-rendered-request';
import { RenderLifecycleState } from '../render-lifecycle-state';
import { F_FLOW, FFlowBase } from '../../../../f-flow/f-flow-base';

@Injectable()
@FExecutionRegister(NotifyNodesRenderedRequest)
export class NotifyNodesRendered implements IExecution<NotifyNodesRenderedRequest, void> {
  private readonly _state = inject(RenderLifecycleState);
  private readonly _fFlow = inject<FFlowBase>(F_FLOW);

  public handle(_: NotifyNodesRenderedRequest): void {
    if (this._state.isNodesRendered) {
      return;
    }

    this._state.isNodesRendered = true;
    this._fFlow.fNodesRendered.emit(this._fFlow.fId());
  }
}
