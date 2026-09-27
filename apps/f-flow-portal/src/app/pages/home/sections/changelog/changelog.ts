import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHead } from '../../../../shared';

interface IChangelogItem {
  version: string;
  date: string;
  description: string;
  href: string;
}

/**
 * Latest three published releases, mirrored from the root changelog. Keep this
 * list in sync when a release lands — it is the shortest "is the project alive?"
 * signal on the home page.
 */
const CHANGELOG: IChangelogItem[] = [
  {
    version: 'v19.3.0',
    date: 'September 2026',
    description:
      'Strict CSP support without unsafe-inline, smoother connection routing through waypoints, drops that attach to the intended connector, snap target events, and new dev diagnostics.',
    href: 'https://flow.foblex.com/blog/foblex-flow-v19-3-0-strict-csp-support-waypoint-routing-and-new-diagnostics',
  },
  {
    version: 'v19.1.0',
    date: 'July 2026',
    description:
      'Managed Flow State with batched undo and redo, faster rendering for large flows, and interaction support inside Angular Elements and open Shadow DOM.',
    href: 'https://flow.foblex.com/blog/foblex-flow-v19-1-0-managed-state-faster-large-flows-and-shadow-dom-support',
  },
  {
    version: 'v19.0.0',
    date: 'July 2026',
    description:
      'Control schemes, click-to-connect, keyboard accessibility, a unified connector model, and an AI-ready integration toolchain.',
    href: 'https://flow.foblex.com/blog/foblex-flow-v19-0-0-control-schemes-click-to-connect-keyboard-accessibility-and-a-unified-connector-model',
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
