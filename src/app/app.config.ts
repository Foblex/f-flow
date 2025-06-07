import {ApplicationConfig, ErrorHandler, Injectable, provideZoneChangeDetection} from '@angular/core';
import {provideRouter,} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideGTag, provideTheme} from "@foblex/m-render";

@Injectable()
export class ClientErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('[ClientErrorHandler]', error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay()),
    {provide: ErrorHandler, useClass: ClientErrorHandler},
    provideGTag({id: 'AW-16677977117'}),
    provideTheme()
  ]
};

