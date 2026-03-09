import { InjectionToken, Provider } from '@angular/core';

export interface ICacheOptions {
  enabled: boolean;
}

const DEFAULT_CACHE_OPTIONS: ICacheOptions = {
  enabled: false,
};

export const F_CACHE_OPTIONS = new InjectionToken<ICacheOptions>('F_CACHE_OPTIONS', {
  providedIn: 'root',
  factory: () => ({
    ...DEFAULT_CACHE_OPTIONS,
  }),
});

export function fProvideCache(options: Partial<ICacheOptions> = {}): Provider {
  return {
    provide: F_CACHE_OPTIONS,
    useValue: {
      ...DEFAULT_CACHE_OPTIONS,
      ...options,
    },
  };
}
