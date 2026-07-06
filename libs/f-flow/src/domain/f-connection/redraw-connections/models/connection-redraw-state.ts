import { Injectable } from '@angular/core';
import { FConnectorBase } from '../../../../f-connectors';

@Injectable()
export class ConnectionRedrawState {
  public renderTicket = 0;

  /**
   * False while a (possibly sliced/worker-async) pass is still running. A
   * scoped redraw starting now would invalidate that pass mid-flight and leave
   * its remaining connections undrawn, so pending scopes escalate to a full
   * pass until the previous one completed.
   */
  public isPassCompleted = true;

  private readonly _connectedInPreviousRender = new Set<FConnectorBase>();

  public beginRender(): number {
    this.isPassCompleted = false;

    return ++this.renderTicket;
  }

  public resetConnectedConnectors(): void {
    for (const connector of this._connectedInPreviousRender) {
      connector.resetConnected();
    }

    this._connectedInPreviousRender.clear();
  }

  public trackConnectedConnectors(source: FConnectorBase, target: FConnectorBase): void {
    this._connectedInPreviousRender.add(source);
    this._connectedInPreviousRender.add(target);
  }
}
