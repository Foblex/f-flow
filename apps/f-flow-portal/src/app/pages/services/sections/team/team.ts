import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEAM } from '../../../../core/team';
import { SectionHead } from '../../../../shared';

@Component({
  selector: 'services-team',
  templateUrl: './team.html',
  styleUrl: './team.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHead],
})
export class Team {
  /** Shared portal-wide team source — edit in `core/team`. */
  protected readonly members = TEAM;
}
