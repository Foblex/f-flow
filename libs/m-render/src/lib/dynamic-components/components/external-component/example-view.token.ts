import { computed, Injectable, InjectionToken, Signal, signal } from '@angular/core';

export interface IExampleView {
  readonly isFullscreen: Signal<boolean>;
  readonly isLoading: Signal<boolean>;

  showLoading(): void;
  hideLoading(): void;
}

export const EXAMPLE_VIEW = new InjectionToken<IExampleView>('EXAMPLE_VIEW');

@Injectable()
export class ExampleViewController implements IExampleView {
  private readonly _isFullscreen = signal(false);
  private readonly _loadingCount = signal(0);

  public readonly isFullscreen = this._isFullscreen.asReadonly();
  public readonly isLoading = computed(() => this._loadingCount() > 0);

  public showLoading(): void {
    this._loadingCount.update((value) => value + 1);
  }

  public hideLoading(): void {
    this._loadingCount.update((value) => Math.max(0, value - 1));
  }

  public setFullscreen(value: boolean): void {
    this._isFullscreen.set(value);
  }
}
