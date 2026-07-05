import { IHasHostElement } from '../i-has-host-element';
import { Signal } from '@angular/core';
import { EFConnectableSide } from '../f-connection-v2/enums/e-f-connectable-side';

export type FConnectorKind = 'input' | 'output' | 'outlet' | 'connector';

export abstract class FConnectorBase implements IHasHostElement {
  /** Connector role: `'connector'` for the unified `[fConnector]`, or the legacy `'input'` / `'output'` / `'outlet'`. */
  public abstract readonly kind: FConnectorKind;

  /** Connector identifier referenced by `<f-connection>` via `fSourceId` / `fTargetId`. Comparison is exact and string-based. */
  public abstract fId: Signal<string>;

  /**
   * Optional category used to match a target connector against
   * source connection limits (`fCanBeConnectedTo` / `fCanBeConnectedInputs`).
   */
  public category?: Signal<string | undefined>;

  /** Id of the node this connector belongs to; connectors must live inside `[fNode]` / `[fGroup]`. */
  public abstract fNodeId: string;

  /** Host element of the owning node. */
  public abstract fNodeHost: HTMLElement | SVGElement;

  /** Disables this connector for new connections (`fConnectorDisabled` / legacy per-role inputs). */
  public abstract disabled: Signal<boolean>;

  public abstract hostElement: HTMLElement | SVGElement;

  /** Whether this connector currently accepts a connection, per multiplicity and disabled state. */
  public abstract canBeConnected: boolean;

  private _isConnected: boolean = false;

  /** `true` while at least one rendered connection is attached to this connector. */
  public get isConnected(): boolean {
    return this._isConnected;
  }

  public toConnector: FConnectorBase[] = [];

  /** Whether a connection may start and end on connectors of the same node. */
  public isSelfConnectable: boolean = true;

  /** Side of the node the connection attaches to (`AUTO` resolves from geometry). */
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
