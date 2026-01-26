import { IHasHostElement } from '../i-has-host-element';
import { Signal } from '@angular/core';
import { EFConnectableSide } from '../f-connection-v2/enums/e-f-connectable-side';

export abstract class FConnectorBase implements IHasHostElement {
  public abstract fId: Signal<string>;

  public abstract fNodeId: string;

  public abstract fNodeHost: HTMLElement | SVGElement;

  public abstract disabled: Signal<boolean>;

  public abstract hostElement: HTMLElement | SVGElement;

  public abstract canBeConnected: boolean;

  private _isConnected: boolean = false;

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public toConnector: FConnectorBase[] = [];

  public isSelfConnectable: boolean = true;

  public fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public userFConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public isContains(element: HTMLElement | SVGElement): boolean {
    return this.hostElement.contains(element);
  }

  public setConnected(toConnector: FConnectorBase): void {
    this._isConnected = true;
    this.toConnector.push(toConnector);
  }

  public resetConnected(): void {
    this._isConnected = false;
    this.toConnector = [];
  }
}
