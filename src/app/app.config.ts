import {
  ApplicationConfig,
  provideZoneChangeDetection
} from '@angular/core';
import {
  provideRouter,
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideClientHydration(),
  ]
};
