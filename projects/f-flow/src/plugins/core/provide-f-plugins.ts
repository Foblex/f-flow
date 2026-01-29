import { InjectionToken, Provider, StaticProvider } from '@angular/core';

export const F_PLUGINS = new InjectionToken<(Provider | StaticProvider)[]>('F_PLUGINS');

export function provideFPlugins(providers: (Provider | StaticProvider)[]): Provider {
  return {
    provide: F_PLUGINS,
    useValue: providers,
  };
}
