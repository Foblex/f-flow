import { Subject } from 'rxjs';
import { IHasHostElement } from '@foblex/core';
import { EFConnectableSide } from './e-f-connectable-side';
import { IHasStateChanges } from '../i-has-state-changes';

export abstract class FConnectorBase implements IHasStateChanges, IHasHostElement {

  public abstract id: string;

  public abstract disabled: boolean;

  public abstract hostElement: HTMLElement | SVGElement;

  public readonly stateChanges: Subject<void> = new Subject<void>();

  public abstract canBeConnected: boolean;

  public abstract isConnected: boolean;

  public isSelfConnectable: boolean = true;

  public fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public _fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public isContains(element: HTMLElement | SVGElement): boolean {
    return this.hostElement.contains(element);
  }

  public setConnected(isConnected: boolean): void {
    this.isConnected = isConnected;
  }
}
