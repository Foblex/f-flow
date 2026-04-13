import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { NotifyFullRenderedRequest } from './notify-full-rendered-request';
import { RenderLifecycleState } from '../render-lifecycle-state';
import { F_FLOW, FFlowBase } from '../../../../f-flow/f-flow-base';

@Injectable()
@FExecutionRegister(NotifyFullRenderedRequest)
export class NotifyFullRendered implements IExecution<NotifyFullRenderedRequest, void> {
  private readonly _state = inject(RenderLifecycleState);
  private readonly _fFlow = inject<FFlowBase>(F_FLOW);

  public handle(_: NotifyFullRenderedRequest): void {
    if (this._state.isFullRendered) {
      return;
    }

    this._state.isFullRendered = true;
    this._fFlow.fFullRendered.emit(this._fFlow.fId());
    this._fFlow.fLoaded.emit(this._fFlow.fId());
  }
}
