import { EFConnectableSide } from './e-f-connectable-side';
import { IHasHostElement } from '../i-has-host-element';

export abstract class FConnectorBase implements IHasHostElement {

  public abstract fId: string;

  public abstract disabled: boolean;

  public abstract hostElement: HTMLElement | SVGElement;

  public abstract canBeConnected: boolean;

  private _isConnected: boolean = false;

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public toConnector: FConnectorBase | undefined;

  public isSelfConnectable: boolean = true;

  public fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public userFConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public isContains(element: HTMLElement | SVGElement): boolean {
    return this.hostElement.contains(element);
  }

  public setConnected(isConnected: boolean, toConnector?: FConnectorBase): void {
    this._isConnected = isConnected;
    this.toConnector = toConnector;
  }
}
