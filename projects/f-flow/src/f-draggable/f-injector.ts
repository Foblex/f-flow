import {Injector, Type} from "@angular/core";

export class FInjector {

  private static _injector: Injector | undefined;

  public static set(injector: Injector): void {
    this._injector = injector;
  }

  public static clear(): void {
    this._injector = undefined;
  }

  public static get(): Injector {
    if (!this._injector) {
      throw new Error('No injector available');
    }
    return this._injector;
  }
}

export function fInject<T>(token: Type<T>): T {
  return FInjector.get().get(token);
}
