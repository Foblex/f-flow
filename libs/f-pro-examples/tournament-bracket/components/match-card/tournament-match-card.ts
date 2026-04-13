import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITournamentBracketItem } from '../../domain';

@Component({
  selector: 'tournament-match-card',
  templateUrl: './tournament-match-card.html',
  styleUrls: ['./tournament-match-card.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
})
export class TournamentMatchCard {
  public readonly match = input.required<ITournamentBracketItem>();
}
