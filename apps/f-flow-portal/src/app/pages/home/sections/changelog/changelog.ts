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
    version: 'v19.1.0',
    date: 'July 2026',
    description:
      'Managed Flow State with batched undo and redo, faster rendering for large flows, and interaction support inside Angular Elements and open Shadow DOM.',
    routerLink: '/blog/foblex-flow-v19-1-0-managed-state-faster-large-flows-and-shadow-dom-support',
  },
  {
    version: 'v19.0.0',
    date: 'July 2026',
    description:
      'Control schemes, click-to-connect, keyboard accessibility, a unified connector model, and an AI-ready integration toolchain.',
    routerLink:
      '/blog/foblex-flow-v19-0-0-control-schemes-click-to-connect-keyboard-accessibility-and-a-unified-connector-model',
  },
  {
    version: 'v18.6.0',
    date: 'April 2026',
    description:
      'Smart Auto-Layout on Resize: when a node grows or shrinks, the surrounding nodes shift automatically along configurable mode, scope, axis, and collision rules.',
    routerLink: '/blog/foblex-flow-v18-6-0-smart-auto-layout-on-resize',
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
