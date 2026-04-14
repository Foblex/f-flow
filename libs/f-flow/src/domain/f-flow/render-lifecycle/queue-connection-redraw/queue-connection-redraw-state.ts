import { Injectable } from '@angular/core';

@Injectable()
export class QueueConnectionRedrawState {
  public isWaitingForViewportAnimation = false;
  public pendingRedraw = false;
}
