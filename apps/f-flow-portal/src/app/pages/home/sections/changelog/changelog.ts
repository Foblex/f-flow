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
    version: 'v19.1.6',
    date: 'July 27, 2026',
    description:
      'Correct layout-package peer metadata for clean installation with the current Foblex Flow 19.x line.',
    href: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md#1916---2026-07-27',
  },
  {
    version: 'v19.1.5',
    date: 'July 27, 2026',
    description:
      'Selection-aware managed snapshots, precise item centering, better keyboard navigation, and a complete Marketing Automation reference app.',
    href: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md#1915---2026-07-27',
  },
  {
    version: 'v19.1.4',
    date: 'July 18, 2026',
    description:
      'Safer reactive teardown prevents delayed Flow callbacks from reaching destroyed Angular views and intermittently breaking embedded examples.',
    href: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md#1914---2026-07-18',
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
