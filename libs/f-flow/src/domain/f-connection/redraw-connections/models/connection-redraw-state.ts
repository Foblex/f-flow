import { Injectable } from '@angular/core';
import { FConnectorBase } from '../../../../f-connectors';

@Injectable()
export class ConnectionRedrawState {
  public renderTicket = 0;

  private readonly _connectedInPreviousRender = new Set<FConnectorBase>();

  public beginRender(): number {
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
