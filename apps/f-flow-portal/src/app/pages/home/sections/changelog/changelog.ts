import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHead } from '../../../../shared';

interface IChangelogItem {
  version: string;
  date: string;
  description: string;
  routerLink: string;
}

/**
 * Latest three release blog posts, mirrored from the "Releases" group
 * in blog-config.ts so each card links to the real write-up. Keep in
 * sync when a new release post lands — this is the shortest "is the
 * project alive?" signal on the home page.
 */
const CHANGELOG: IChangelogItem[] = [
  {
    version: 'v18.5.0',
    date: 'April 2026',
    description:
      'Dagre and ELK layout packages, explicit render lifecycle outputs, standalone reference apps, and a stronger portal/docs toolchain.',
    routerLink:
      '/blog/foblex-flow-v18-5-0-layout-engines-explicit-render-lifecycle-and-standalone-reference-apps',
  },
  {
    version: 'v18.4.0',
    date: 'April 2026',
    description:
      'Opt-in f-auto-pan plugin, default theme entrypoint, smoother trackpad pinch-to-zoom, and refreshed example portal controls.',
    routerLink: '/blog/foblex-flow-v18-4-0-auto-pan-default-theme-and-smoother-trackpad-zoom',
  },
  {
    version: 'v18.3.0',
    date: 'March 2026',
    description:
      'Projected connection gradients, smarter redraws, production-worker hardening, and refreshed roadmap/docs guidance.',
    routerLink:
      '/blog/foblex-flow-v18-3-0-projected-connection-gradients-smarter-redraws-and-production-worker-hardening',
  },
];

@Component({
  selector: 'home-changelog',
  templateUrl: './changelog.html',
  styleUrl: './changelog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionHead],
})
export class Changelog {
  protected readonly items = CHANGELOG;
}
