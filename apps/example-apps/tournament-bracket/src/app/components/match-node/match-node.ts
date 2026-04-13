import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ITournamentMatch } from '../../domain';
import { MatchHeader } from '../match-header/match-header';
import { CompetitorRow } from '../competitor-row/competitor-row';

@Component({
  selector: 'match-node',
  templateUrl: './match-node.html',
  styleUrls: ['./match-node.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchHeader, CompetitorRow],
})
export class MatchNode {
  public readonly match = input.required<ITournamentMatch>();

  public readonly isHighlighted = input<boolean>(false);

  public readonly isDimmed = input<boolean>(false);

  public readonly isSelected = input<boolean>(false);

  public readonly matchClick = output<string>();

  public readonly teamClick = output<string>();

  protected onCardClick(event: Event): void {
    event.stopPropagation();
    this.matchClick.emit(this.match().id);
  }

  protected onCardKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (event.target !== event.currentTarget) {
      return;
    }

    if (keyboardEvent.code === 'Space') {
      keyboardEvent.preventDefault();
    }

    this.onCardClick(keyboardEvent);
  }

  protected onTeamClick(teamName: string): void {
    this.teamClick.emit(teamName);
  }
}
