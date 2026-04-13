import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { SizeExtensions } from '@foblex/2d';
import {
  FCanvasComponent,
  FFlowComponent,
  FFlowModule,
  FZoomDirective,
  provideFLayout,
} from '@foblex/flow';
import { ETournamentLayoutAlgorithm, TournamentLayoutEngine } from '../../layout';
import { TournamentBracketState } from '../../state';
import { BracketController } from '../../controllers';
import { MatchNode } from '../match-node/match-node';
import { BracketToolbar } from '../bracket-toolbar/bracket-toolbar';
import { BracketLegend } from '../bracket-legend/bracket-legend';
import { MatchDetailPanel } from '../match-detail-panel/match-detail-panel';

@Component({
  selector: 'bracket-flow',
  templateUrl: './bracket-flow.html',
  styleUrls: ['./bracket-flow.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TournamentBracketState, BracketController, provideFLayout(TournamentLayoutEngine)],
  imports: [
    FFlowModule,
    FZoomDirective,
    MatchNode,
    BracketToolbar,
    BracketLegend,
    MatchDetailPanel,
  ],
})
export class BracketFlow {
  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild(FCanvasComponent);
  private readonly _zoom = viewChild(FZoomDirective);

  private readonly _layoutEngine = inject(TournamentLayoutEngine);
  private _layoutRequestId = 0;

  protected readonly state = inject(TournamentBracketState);
  protected readonly controller = inject(BracketController);

  protected readonly hasHighlight = computed(() => this.state.highlightedMatchIds().size > 0);

  protected readonly highlightedMatchIds = this.state.highlightedMatchIds;
  protected readonly highlightedConnectionIds = this.state.highlightedConnectionIds;
  protected readonly selectedMatchId = this.state.selectedMatchId;
  protected readonly hasDetailPanel = computed(
    () => this.state.selectedMatch() !== null || this.state.selectedTeam() !== null,
  );

  constructor() {
    effect(() => {
      const algorithm = this.state.algorithm();
      this.state.visibleBrackets();

      void this._applyLayout(algorithm);
    });
  }

  protected flowRendered(): void {
    const flow = this._flow();
    const canvas = this._canvas();
    const zoom = this._zoom();

    if (flow && canvas && zoom) {
      this.controller.initialize(flow, canvas, zoom);
    }

    void this._applyLayout(this.state.algorithm());
  }

  protected onMatchClick(matchId: string): void {
    this.state.selectMatch(matchId);
  }

  protected onTeamClick(teamName: string): void {
    this.state.selectTeam(teamName);
  }

  protected onCanvasClick(): void {
    this.state.clearSelection();
  }

  protected isHighlighted(matchId: string): boolean {
    return this.highlightedMatchIds().has(matchId);
  }

  protected isDimmed(matchId: string): boolean {
    return this.hasHighlight() && !this.highlightedMatchIds().has(matchId);
  }

  protected isSelected(matchId: string): boolean {
    return this.selectedMatchId() === matchId;
  }

  protected isConnectionHighlighted(connectionId: string): boolean {
    return this.highlightedConnectionIds().has(connectionId);
  }

  protected isConnectionDimmed(connectionId: string): boolean {
    return this.hasHighlight() && !this.highlightedConnectionIds().has(connectionId);
  }

  private async _applyLayout(algorithm: ETournamentLayoutAlgorithm): Promise<void> {
    const layoutRequestId = ++this._layoutRequestId;
    const matches = this.state.visibleMatches();
    const connections = this.state.connections();

    const nodes = matches.map((m) => ({
      id: m.id,
      size: SizeExtensions.initialize(220, 120),
    }));

    const layoutConnections = connections.map((c) => ({
      source: c.from,
      target: c.to,
    }));

    const result = await this._layoutEngine.calculate(nodes, layoutConnections, {
      algorithm,
      phases: this.state.phaseMetadata(),
    });

    if (layoutRequestId !== this._layoutRequestId) {
      return;
    }

    const positionMap = new Map(result.nodes.map((n) => [n.id, n.position]));

    matches.forEach((match) => {
      const pos = positionMap.get(match.id);

      if (pos) {
        match.position = pos;
      }
    });

    this.controller.redraw();

    setTimeout(() => this.controller.fitToScreen(), 50);
  }
}
