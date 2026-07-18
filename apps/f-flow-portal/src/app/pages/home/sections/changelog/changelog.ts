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
    version: 'v19.1.4',
    date: 'July 18, 2026',
    description:
      'Safer reactive teardown prevents delayed Flow callbacks from reaching destroyed Angular views and intermittently breaking embedded examples.',
    href: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md#1914---2026-07-18',
  },
  {
    version: 'v19.1.3',
    date: 'July 17, 2026',
    description:
      'Stable managed viewport history, a practical 350ms transform debounce, and cancellation of stale dynamic component renders.',
    href: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md#1913---2026-07-17',
  },
  {
    version: 'v19.1.2',
    date: 'July 13, 2026',
    description:
      'Reliable unified-connector creation and side resolution, plus a complete State-powered refresh of the Call Center reference app.',
    href: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md#1912---2026-07-13',
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
