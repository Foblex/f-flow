import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import {
  F_REFLOW_CONFIG,
  IFReflowOnResizeConfig,
  IFReflowOnResizeResolvedConfig,
  mergeReflowConfig,
} from './i-f-reflow-on-resize-config';

/**
 * Public runtime API for the reflow-on-resize feature.
 *
 * Always instantiated at the `<f-flow>` injector level — regardless of
 * whether `withReflowOnResize(...)` was registered. The feature is inert
 * until `F_REFLOW_CONFIG` becomes available through the optional inject;
 * without it, `isEnabled` is `false` and the orchestrator short-circuits.
 *
 * ```typescript
 * const reflow = inject(FReflowController);
 * reflow.setConfig({ spacing: { vertical: 24 } });
 * ```
 */
@Injectable()
export class FReflowController {
  private readonly _initial = inject(F_REFLOW_CONFIG, { optional: true });

  private readonly _featureActivated = this._initial !== null;

  private readonly _config: WritableSignal<IFReflowOnResizeResolvedConfig> = signal(
    this._initial ?? mergeReflowConfig(undefined),
  );

  public readonly config: Signal<IFReflowOnResizeResolvedConfig> = this._config.asReadonly();

  public readonly isEnabled: Signal<boolean> = computed(
    () => this._featureActivated && this._config().enabled,
  );

  public getConfig(): IFReflowOnResizeResolvedConfig {
    return this._config();
  }

  public setConfig(partial: IFReflowOnResizeConfig): void {
    this._config.set(mergeReflowConfig({ ...this._config(), ...partial }));
  }
}
