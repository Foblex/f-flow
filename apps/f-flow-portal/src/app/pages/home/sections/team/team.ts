import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contributors } from '../../../../core/contributors';
import { CORE_GITHUB_LOGINS, TEAM } from '../../../../core/team';
import { SectionHead } from '../../../../shared';

/**
 * Cap on how many community contributors render inline as pills. The
 * full list lives on GitHub's contributors graph; a "See all …" link
 * surfaces the overflow without letting the grid grow unbounded on
 * pages with many contributors.
 */
const MAX_VISIBLE_CONTRIBUTORS = 24;

const CONTRIBUTORS_GRAPH_URL = 'https://github.com/Foblex/f-flow/graphs/contributors';

@Component({
  selector: 'home-team',
  templateUrl: './team.html',
  styleUrl: './team.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionHead],
})
export class Team {
  private readonly _contributors = inject(Contributors);

  /**
   * Core maintainers are edited in `core/team` and reused here +
   * on the services page + (future) /team page.
   */
  protected readonly members = TEAM;

  protected readonly contributorsGraphUrl = CONTRIBUTORS_GRAPH_URL;

  private readonly _allContributors = computed(() =>
    this._contributors
      .snapshot()
      .list.filter((c) => !CORE_GITHUB_LOGINS.has(c.login.toLowerCase())),
  );

  protected readonly contributors = computed(() =>
    this._allContributors().slice(0, MAX_VISIBLE_CONTRIBUTORS),
  );

  protected readonly overflowCount = computed(() =>
    Math.max(0, this._allContributors().length - MAX_VISIBLE_CONTRIBUTORS),
  );
}
