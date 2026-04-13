import { Injectable } from '@angular/core';

@Injectable()
export class RenderLifecycleState {
  public isNodesRendered = false;
  public isFullRendered = false;
}
