import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TournamentBracketState } from '../../state';
import { TTournamentBracketType } from '../../layout';

@Component({
  selector: 'bracket-legend',
  templateUrl: './bracket-legend.html',
  styleUrls: ['./bracket-legend.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip],
})
export class BracketLegend {
  protected readonly state = inject(TournamentBracketState);

  protected readonly stats = this.state.tournamentStats;

  protected readonly visibleBrackets = this.state.visibleBrackets;

  protected isBracketVisible(bracket: TTournamentBracketType): boolean {
    return this.state.visibleBrackets().has(bracket);
  }

  protected onToggleBracket(bracket: TTournamentBracketType): void {
    this.state.toggleBracket(bracket);
  }

  protected onShowAll(): void {
    this.state.showAllBrackets();
  }
}
