import { computed, inject, InjectionToken, Signal, signal, WritableSignal } from '@angular/core';
import { EFLayoutMode } from './enums';
import { FLayoutController } from './flow-integration';
import {
  F_LAYOUT_OPTIONS,
  IFLayoutCalculationOptions,
  IFLayoutConnection,
  IFLayoutNode,
  IFLayoutOptions,
  IFLayoutProviderConfig,
  IFLayoutResult,
  TFLayoutWritebackHandler,
} from './models';

export const F_LAYOUT = new InjectionToken<FLayoutEngine>('F_LAYOUT');

type TReadonlyDeep<T> = {
  readonly [K in keyof T]: T[K] extends object ? TReadonlyDeep<T[K]> : T[K];
};

export abstract class FLayoutEngine<
  TOptions extends IFLayoutOptions<string> = IFLayoutOptions<string>,
> {
  private readonly _controller = inject(FLayoutController);
  private readonly _config =
    (inject(F_LAYOUT_OPTIONS, { optional: true }) as IFLayoutProviderConfig<TOptions> | null) ?? {};

  private _interactiveOptions!: WritableSignal<TOptions>;
  private _mode: EFLayoutMode;
  private _writeback: TFLayoutWritebackHandler | null;
  private _defaultOptions: TOptions;

  public readonly interactiveOptions!: Signal<TReadonlyDeep<TOptions>>;

  protected constructor(defaultOptions: TOptions) {
    this._mode = this._config.mode ?? EFLayoutMode.MANUAL;
    this._writeback = this._config.writeback ?? null;
    this._defaultOptions = this.mergeOptions(defaultOptions, this._config.options);
    this._interactiveOptions = signal(this.mergeOptions(this._defaultOptions, {}));
    this.interactiveOptions = computed(() =>
      this.mergeOptions(this._interactiveOptions(), {}),
    ) as Signal<TReadonlyDeep<TOptions>>;

    this._controller.attachEngine(this);
  }

  public setMode(mode: EFLayoutMode): void {
    this._mode = mode;
    this._controller.handleModeChanged(mode);
  }

  public getMode(): EFLayoutMode {
    return this._mode;
  }

  public setWriteback(handler: TFLayoutWritebackHandler | null): void {
    this._writeback = handler;
  }

  public getWriteback(): TFLayoutWritebackHandler | null {
    return this._writeback;
  }

  public setInteractiveOptions(options: Partial<TOptions>): void {
    this._interactiveOptions.set(this.mergeOptions(this._interactiveOptions(), options));
  }

  public relayout(flowId?: string): Promise<void> {
    return this._controller.relayout(flowId);
  }

  public getProviderConfig(): IFLayoutProviderConfig<TOptions> {
    return { ...this._config };
  }

  protected resolveLayoutOptions(options?: IFLayoutCalculationOptions<TOptions>): TOptions {
    const layoutOptions = {
      ...(options ?? {}),
    } as Partial<TOptions> & { flowId?: string; mode?: EFLayoutMode };

    delete layoutOptions.flowId;
    delete layoutOptions.mode;

    return this.mergeOptions(this._interactiveOptions(), layoutOptions);
  }

  protected abstract mergeOptions(
    currentOptions: TOptions,
    nextOptions?: Partial<TOptions>,
  ): TOptions;

  public abstract calculate(
    nodes: IFLayoutNode[],
    connections: IFLayoutConnection[],
    options?: IFLayoutCalculationOptions<TOptions>,
  ): Promise<IFLayoutResult>;
}
