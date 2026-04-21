import {
  ApplicationConfig,
  inject,
  mergeApplicationConfig,
  provideAppInitializer,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { LOCATION } from '@foblex/m-render';
import { appConfig } from '../app/app.config';
import { Stats } from '../app/core/stats';
import { Contributors } from '../app/core/contributors';
import { fetchStatsWithCache } from './stats';
import { fetchContributorsWithCache } from './contributors';

const SITE_ORIGIN = process.env['SITE_ORIGIN'] || 'https://flow.foblex.com';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      // Used by @foblex/m-render to build absolute canonical/og URLs in SSR/prerender.
      provide: LOCATION,
      useValue: { origin: SITE_ORIGIN },
    },
    // Fetches upstream project stats during SSR bootstrap (GitHub stars,
    // npm weekly installs, latest version) and hands them to the Stats
    // service. The service copies the snapshot into TransferState so
    // hydration on the client reads it without a second HTTP round-trip.
    provideAppInitializer(async () => {
      const stats = inject(Stats);
      const contributors = inject(Contributors);

      const [statsSnapshot, contributorsSnapshot] = await Promise.all([
        fetchStatsWithCache(),
        fetchContributorsWithCache(),
      ]);

      stats.hydrate(statsSnapshot);
      contributors.hydrate(contributorsSnapshot);
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
