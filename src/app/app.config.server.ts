import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { LOCATION } from '@foblex/m-render';
import { appConfig } from './app.config';

const SITE_ORIGIN = process.env['SITE_ORIGIN'] || 'https://flow.foblex.com';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      // Used by @foblex/m-render to build absolute canonical/og URLs in SSR/prerender.
      provide: LOCATION,
      useValue: { origin: SITE_ORIGIN },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
