import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule, FNodeBase,
} from '@foblex/flow';
import { ITournamentBracketItem } from './i-tournament-bracket-item';
import { TournamentBracket } from './tournament-bracket';
import { TOURNAMENT_BRACKET_STORE } from './storage';
import { DatePipe } from '@angular/common';
import { PointExtensions } from '@foblex/2d';

@Component({
  selector: 'tournament-bracket',
  templateUrl: './tournament-bracket.component.html',
  styleUrls: [ './tournament-bracket.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    DatePipe,
  ]
})
export class TournamentBracketComponent implements OnInit {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvasComponent!: FCanvasComponent;

  public viewModel: ITournamentBracketItem[] = [];

  public ngOnInit(): void {
    this.viewModel = new TournamentBracket(TOURNAMENT_BRACKET_STORE, 200, 113, 100, 150).calculate();
  }

  public onInitialized(): void {
    this.fCanvasComponent.fitToScreen(PointExtensions.initialize(100, 100), false);
  }
}
