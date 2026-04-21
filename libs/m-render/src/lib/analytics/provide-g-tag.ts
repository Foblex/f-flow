import { InjectionToken, Provider } from '@angular/core';
import { GTagService } from './g-tag.service';

export function provideGTag(config: GTagConfig): Provider[] {
  return [
    {
      provide: GTAG_CONFIG,
      useValue: config,
    },
    {
      provide: GTagService,
      useClass: GTagService,
    },
  ];
}

export interface GTagConfig {
  id: string;
  extraIds?: string[];
  autoPageview?: boolean;
  initialConsent?: ConsentState;
}

export const GTAG_CONFIG = new InjectionToken<GTagConfig>('GTAG_CONFIG');

export type ConsentState = 'granted' | 'denied';
