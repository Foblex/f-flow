import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IFControlScheme, IFControlSchemeConfig } from './i-f-control-scheme';
import { F_CONTROL_SCHEME_CONFIG } from './merge-control-scheme-config';
import { F_DEFAULT_CONTROL_SCHEME } from './constants';

/**
 * Public runtime API for the control-scheme feature.
 *
 * Provided by `withControlScheme(...)` at the component that calls `provideFFlow(...)`,
 * so that component can `inject(FControlSchemeController)` directly while the directives
 * inside `<f-flow>` read the same instance up the injector chain. Without the feature
 * the directives fall back to {@link F_DEFAULT_CONTROL_SCHEME}.
 *
 * ```typescript
 * const controlScheme = inject(FControlSchemeController);
 * controlScheme.setScheme(F_SCROLL_PAN_CONTROL_SCHEME);
 * controlScheme.setScheme({ scrollPan: false }); // override a single gesture
 * ```
 */
@Injectable()
export class FControlSchemeController {
  private readonly _initial = inject(F_CONTROL_SCHEME_CONFIG, { optional: true });

  private readonly _scheme: WritableSignal<IFControlScheme> = signal(
    this._initial ?? F_DEFAULT_CONTROL_SCHEME,
  );

  /** The active scheme; directives read this so runtime changes apply immediately. */
  public readonly scheme: Signal<IFControlScheme> = this._scheme.asReadonly();

  public getScheme(): IFControlScheme {
    return this._scheme();
  }

  /** Merges the given gestures over the current scheme; a full preset replaces it. */
  public setScheme(scheme: IFControlSchemeConfig): void {
    this._scheme.update((current) => ({ ...current, ...scheme }));
  }
}
