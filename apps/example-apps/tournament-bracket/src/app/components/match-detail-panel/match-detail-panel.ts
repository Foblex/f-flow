import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TournamentBracketState } from '../../state';

@Component({
  selector: 'match-detail-panel',
  templateUrl: './match-detail-panel.html',
  styleUrls: ['./match-detail-panel.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatIcon],
})
export class MatchDetailPanel {
  protected readonly state = inject(TournamentBracketState);

  protected readonly match = this.state.selectedMatch;

  protected readonly selectedTeam = this.state.selectedTeam;

  protected readonly teamMatchCount = computed(() => {
    const team = this.state.selectedTeam();

    if (!team) {
      return 0;
    }

    return this.state.highlightedMatchIds().size;
  });

  protected readonly teamWins = computed(() => {
    const team = this.state.selectedTeam();

    if (!team) {
      return 0;
    }

    let wins = 0;

    this.state.matches().forEach((m) => {
      const competitor = m.competitors.find((c) => c.name === team);

      if (competitor?.isWinner) {
        wins++;
      }
    });

    return wins;
  });

  protected readonly teamLosses = computed(() => {
    const team = this.state.selectedTeam();

    if (!team) {
      return 0;
    }

    let losses = 0;

    this.state.matches().forEach((m) => {
      const competitor = m.competitors.find((c) => c.name === team);

      if (competitor && !competitor.isWinner && m.status === 'completed') {
        losses++;
      }
    });

    return losses;
  });

  protected onClose(): void {
    this.state.clearSelection();
  }

  protected onTeamSelect(teamName: string): void {
    this.state.selectTeam(teamName);
  }
}
