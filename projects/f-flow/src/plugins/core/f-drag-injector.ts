import { inject, Injectable, Injector, ProviderToken } from '@angular/core';
import { F_PLUGINS } from './provide-f-plugins';

interface IHasDestroy {
  destroy?(): void;
}

@Injectable()
export class FDragInjector {
  private readonly _injector = inject(Injector);
  private _dragInjector: Injector | null = null;

  public create(): void {
    this._dragInjector = Injector.create({
      providers: this._injector.get(F_PLUGINS),
      parent: this._injector,
    });
  }

  public get<T>(token: ProviderToken<T>): T {
    if (!this._dragInjector) {
      throw new Error('FDragInjector has not been created. Call create() before using get().');
    }

    return this._dragInjector.get(token);
  }

  public destroy(): void {
    (this._dragInjector as IHasDestroy)?.destroy?.();
    this._dragInjector = null;
  }
}
