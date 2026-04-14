import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITournamentMatch, TMatchStatus } from '../../domain';

@Component({
  selector: 'match-header',
  templateUrl: './match-header.html',
  styleUrls: ['./match-header.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
})
export class MatchHeader {
  public readonly match = input.required<ITournamentMatch>();

  protected readonly bracketLabel = computed(() => {
    const bracket = this.match().bracket;

    switch (bracket) {
      case 'upper':
        return 'UB';
      case 'lower':
        return 'LB';
      case 'final':
        return 'Final';
    }
  });

  protected readonly statusClass = computed(() => {
    const status: TMatchStatus = this.match().status;

    return `status-${status}`;
  });
}
