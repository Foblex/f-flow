import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ResetRenderLifecycleRequest } from './reset-render-lifecycle-request';
import { RenderLifecycleState } from '../render-lifecycle-state';

@Injectable()
@FExecutionRegister(ResetRenderLifecycleRequest)
export class ResetRenderLifecycle implements IExecution<ResetRenderLifecycleRequest, void> {
  private readonly _state = inject(RenderLifecycleState);

  public handle(_: ResetRenderLifecycleRequest): void {
    this._state.isNodesRendered = false;
    this._state.isFullRendered = false;
  }
}
