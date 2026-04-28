import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  EFLayoutDirection,
  FCanvasComponent,
  FFlowComponent,
  FFlowModule,
  FZoomDirective,
  IFLayoutCalculationOptions,
  provideFLayout,
} from '@foblex/flow';
import { PointExtensions } from '@foblex/2d';
import { FSelectComponent, FToolbarComponent } from '@foblex/m-render';
import { map, Observable, take } from 'rxjs';
import {
  EElkLayoutAlgorithm,
  ElkLayoutEngine,
  IElkLayoutEngineOptions,
} from '@foblex/flow-elk-layout';
import { applyLayout } from '../utils/apply-layout';
import {
  DEFAULT_NODE_SIZE,
  generateGraph,
  IConnection,
  IGraph,
  INode,
} from '../utils/generate-graph';
import {
  ELayoutSpacingPreset,
  ELK_LAYOUT_ALGORITHM_OPTIONS,
  LAYOUT_DIRECTION_OPTIONS,
  LAYOUT_SPACING_OPTIONS,
  LAYOUT_SPACING_PRESETS,
} from '../utils/layout-controls';
import { getElkLayoutConnectionSides } from '../utils/layout-connection-sides';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Component({
  selector: 'elk-layout',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FZoomDirective, FToolbarComponent, FSelectComponent],
  providers: [provideFLayout(ElkLayoutEngine)],
})
export class Example implements OnInit {
  private readonly _layout = inject(ElkLayoutEngine);
  private readonly _injector = inject(Injector);

  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly directions = LAYOUT_DIRECTION_OPTIONS;
  protected readonly algorithms = ELK_LAYOUT_ALGORITHM_OPTIONS;
  protected readonly spacings = LAYOUT_SPACING_OPTIONS;

  // The template renders the fully calculated graph from these signals.
  protected readonly nodes = signal<INode[]>([]);
  protected readonly connections = signal<IConnection[]>([]);

  // Toolbar state is the single source of truth for graph generation and relayout.
  protected readonly direction = signal(EFLayoutDirection.TOP_BOTTOM);
  protected readonly algorithm = signal<EElkLayoutAlgorithm>(EElkLayoutAlgorithm.LAYERED);
  protected readonly spacing = signal(ELayoutSpacingPreset.SPACIOUS);
  protected readonly connectionSides = computed(() =>
    getElkLayoutConnectionSides(this.direction(), this.algorithm()),
  );
  private readonly _nodeCount = signal(10);

  public ngOnInit(): void {
    this._listenToolbarChanges();
  }

  private _listenToolbarChanges(): void {
    effect(
      () => {
        // Any toolbar change or node-count change rebuilds the whole example graph.
        this._nodeCount();
        this.direction();
        this.algorithm();
        this.spacing();

        untracked(() => {
          // Rebuild writes to other signals, so we keep those writes outside the effect graph.
          this._rebuildGraph();
        });
      },
      { injector: this._injector },
    );
  }

  private _rebuildGraph(): void {
    this._buildLayoutGraph()
      .pipe(take(1))
      .subscribe((graph) => this._showGraph(graph));
  }

  private _buildLayoutGraph(): Observable<IGraph> {
    const { nodes, connections } = generateGraph(this._nodeCount(), DEFAULT_NODE_SIZE);

    // ELK returns only layout positions. We merge them back into the example graph
    // so the template keeps working with the same node and connection shape.
    return fromPromise(
      this._layout.calculate(nodes, connections, this._calculateLayoutOptions()),
    ).pipe(map((layout) => applyLayout({ nodes, connections }, layout)));
  }

  private _calculateLayoutOptions(): IFLayoutCalculationOptions<IElkLayoutEngineOptions> {
    const spacingPreset = LAYOUT_SPACING_PRESETS[this.spacing()];

    // Translate toolbar selections into ELK-specific layout options.
    return {
      algorithm: this.algorithm(),
      direction: this.direction(),
      layerGap: spacingPreset.layerGap,
      nodeGap: spacingPreset.nodeGap,
    };
  }

  private _showGraph(graph: IGraph): void {
    // Reset Flow so the next render emits `fFullRendered` again and refits the canvas.
    // This example recreates the graph for every change, so a full rerender is expected here.
    this._flow()?.reset();

    // Publish the next laid-out graph to the template.
    this.nodes.set(graph.nodes);
    this.connections.set(graph.connections);
  }

  protected loaded(): void {
    // Fit the graph after each completed render.
    this._fitToScreen();
  }

  protected addNode(): void {
    // Node count drives graph generation, so incrementing it is enough to trigger relayout.
    this._nodeCount.update((x) => x + 1);
  }

  private _fitToScreen(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(150, 150), true);
  }
}
