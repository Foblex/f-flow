import { InjectionToken, Signal } from '@angular/core';
import { EFConnectableSide } from '../enums';
import { EFConnectionBehavior, EFConnectionConnectableSide } from '../utils';

export const F_CONNECTION_COMPONENTS_PARENT = new InjectionToken<FConnectionComponentsParent>(
  'F_CONNECTION_COMPONENTS_PARENT',
);

export abstract class FConnectionComponentsParent {
  public abstract fId: Signal<string>;

  /** @deprecated Use `sourceId`. */
  public abstract fOutputId: Signal<string>;

  /** @deprecated Use `targetId`. */
  public abstract fInputId: Signal<string>;

  public abstract sourceId: Signal<string>;

  public abstract targetId: Signal<string>;

  public abstract fBehavior: EFConnectionBehavior;

  public abstract _applyResolvedSidesToConnection(
    sourceSide: EFConnectableSide,
    targetSide: EFConnectableSide,
  ): void;

  /** @deprecated Use `targetSide`. */
  public abstract fInputSide: Signal<EFConnectionConnectableSide>;

  /** @deprecated Use `sourceSide`. */
  public abstract fOutputSide: Signal<EFConnectionConnectableSide>;

  public abstract sourceSide: Signal<EFConnectionConnectableSide>;

  public abstract targetSide: Signal<EFConnectionConnectableSide>;
}
