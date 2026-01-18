import { InjectionToken, Signal } from '@angular/core';
import { EFConnectableSide } from '../enums';
import { EFConnectionBehavior, EFConnectionConnectableSide } from '../utils';

export const F_INJECTABLE_CONNECTION = new InjectionToken<FInjectableConnectionBase>(
  'F_INJECTABLE_CONNECTION',
);

export abstract class FInjectableConnectionBase {
  public abstract fId: Signal<string>;

  public abstract fOutputId: Signal<string>;

  public abstract fInputId: Signal<string>;

  public abstract fStartColor: Signal<string>;

  public abstract fEndColor: Signal<string>;

  public abstract fBehavior: EFConnectionBehavior;

  public abstract _applyResolvedSidesToConnection(
    sourceSide: EFConnectableSide,
    targetSide: EFConnectableSide,
  ): void;

  public abstract fInputSide: Signal<EFConnectionConnectableSide>;

  public abstract fOutputSide: Signal<EFConnectionConnectableSide>;
}
