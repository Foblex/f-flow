import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { PointExtensions } from '@foblex/2d';
import { FCanvasComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { TournamentMatchCard } from '../match-card/tournament-match-card';
import { TournamentBracketState } from '../../state';

@Component({
  selector: 'tournament-bracket',
  templateUrl: './tournament-bracket.html',
  styleUrls: ['./tournament-bracket.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TournamentBracketState],
  imports: [FFlowModule, FZoomDirective, TournamentMatchCard],
})
export class TournamentBracket {
  private readonly _canvas = viewChild(FCanvasComponent);

  protected readonly state = inject(TournamentBracketState);

  protected loaded(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(100, 100), false);
  }
}
