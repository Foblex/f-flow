import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ITournamentCompetitor } from '../../domain';

@Component({
  selector: 'competitor-row',
  templateUrl: './competitor-row.html',
  styleUrls: ['./competitor-row.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetitorRow {
  public readonly competitor = input.required<ITournamentCompetitor>();

  public readonly isLast = input<boolean>(false);

  public readonly teamClicked = output<string>();

  protected onTeamNameClick(event: Event): void {
    event.stopPropagation();
    this.teamClicked.emit(this.competitor().name);
  }
}
