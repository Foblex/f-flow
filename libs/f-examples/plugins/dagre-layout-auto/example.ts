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
import { PointExtensions } from '@foblex/2d';
import {
  EFLayoutDirection,
  EFLayoutMode,
  FCanvasComponent,
  FFlowComponent,
  FFlowModule,
  IFLayoutWritebackPayload,
  provideFLayout,
} from '@foblex/flow';
import { DagreLayoutEngine, EDagreLayoutAlgorithm } from '@foblex/flow-dagre-layout';
import { ExampleSelect, ExampleToolbar } from '@foblex/portal-ui';
import { applyLayout } from '../utils/apply-layout';
import { IConnection, IGraph, INode, generateGraph } from '../utils/generate-graph';
import { getDirectionalLayoutConnectionSides } from '../utils/layout-connection-sides';
import {
  DAGRE_LAYOUT_ALGORITHM_OPTIONS,
  ELayoutSpacingPreset,
  LAYOUT_DIRECTION_OPTIONS,
  LAYOUT_SPACING_OPTIONS,
  LAYOUT_SPACING_PRESETS,
  getLayoutSpacingPreset,
} from '../utils/layout-controls';

@Component({
  selector: 'dagre-layout-auto',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, ExampleToolbar, ExampleSelect],
  providers: [
    provideFLayout(DagreLayoutEngine, {
      mode: EFLayoutMode.AUTO,
      options: {
        nodeGap: LAYOUT_SPACING_PRESETS[ELayoutSpacingPreset.SPACIOUS].nodeGap,
        layerGap: LAYOUT_SPACING_PRESETS[ELayoutSpacingPreset.SPACIOUS].layerGap,
      },
    }),
  ],
})
export class Example implements OnInit {
  private readonly _layout = inject(DagreLayoutEngine);
  private readonly _injector = inject(Injector);

  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild.required(FCanvasComponent);

  private readonly _nodeCount = signal(10);

  protected readonly directions = LAYOUT_DIRECTION_OPTIONS;
  protected readonly algorithms = DAGRE_LAYOUT_ALGORITHM_OPTIONS;
  protected readonly spacings = LAYOUT_SPACING_OPTIONS;

  // The template still renders application-owned graph state.
  // Auto mode does not replace your state model, it only updates positions for it.
  protected readonly nodes = signal<INode[]>([]);
  protected readonly connections = signal<IConnection[]>([]);

  // The toolbar remains the source of truth for demo configuration.
  // Unlike the manual example, these controls do not call `calculate(...)` directly.
  protected readonly direction = signal<EFLayoutDirection>(
    this._layout.interactiveOptions().direction,
  );
  protected readonly algorithm = signal<EDagreLayoutAlgorithm>(
    this._layout.interactiveOptions().algorithm,
  );
  protected readonly spacing = signal<ELayoutSpacingPreset>(
    getLayoutSpacingPreset(
      this._layout.interactiveOptions().nodeGap,
      this._layout.interactiveOptions().layerGap,
    ),
  );
  protected readonly connectionSides = computed(() =>
    getDirectionalLayoutConnectionSides(this.direction()),
  );

  public ngOnInit(): void {
    // `writeback` is the official bridge from auto layout back into application state.
    this._configureLayoutWriteback();

    // Any toolbar change rebuilds the rendered graph, just like in the manual example.
    // The difference is that the actual layout pass now happens inside Flow automatically.
    this._listenToolbarChanges();
  }

  protected loaded(): void {
    this._fitToScreen();
  }

  protected addNode(): void {
    // Changing graph structure is enough for auto mode.
    // Flow will detect the new node after render and request a new layout pass.
    this._nodeCount.update((value) => value + 1);
  }

  private _configureLayoutWriteback(): void {
    this._layout.setWriteback((payload) => this._applyLayoutWriteback(payload));
  }

  private _listenToolbarChanges(): void {
    effect(
      () => {
        // The demo intentionally rebuilds the whole graph on every toolbar change so the
        // auto example stays conceptually close to the manual one.
        this._nodeCount();
        this.direction();
        this.algorithm();
        this.spacing();

        untracked(() => {
          this._rebuildGraph();
        });
      },
      { injector: this._injector },
    );
  }

  private _applyLayoutWriteback(payload: IFLayoutWritebackPayload): void {
    // Auto mode writes calculated positions back through the engine callback.
    // We merge those positions into the current graph so the component state remains authoritative.
    const nextGraph = applyLayout(this._getCurrentGraph(), {
      nodes: [...payload.nodes, ...payload.groups],
    });

    this.nodes.set(nextGraph.nodes);
  }

  private _getCurrentGraph(): IGraph {
    return {
      nodes: this.nodes(),
      connections: this.connections(),
    };
  }

  private _createGraph(): IGraph {
    // We intentionally do not pass `size` here.
    // In auto mode Flow reads the real rendered node size from the DOM via `getState({ measuredSize: true })`
    // before the engine calculates positions. The engine fallback size is only used when no measurement exists.
    return generateGraph(this._nodeCount());
  }

  private _rebuildGraph(): void {
    // Toolbar options still come from the component, but the layout itself is delegated to auto mode.
    // We update engine options, render the fresh graph, and let Flow trigger Dagre afterwards.
    this._layout.setInteractiveOptions(this._calculateLayoutOptions());
    this._showGraph(this._createGraph());
  }

  private _calculateLayoutOptions() {
    const spacingPreset = LAYOUT_SPACING_PRESETS[this.spacing()];

    return {
      direction: this.direction(),
      algorithm: this.algorithm(),
      nodeGap: spacingPreset.nodeGap,
      layerGap: spacingPreset.layerGap,
    };
  }

  private _showGraph(graph: IGraph): void {
    // Resetting Flow allows `fFullRendered` to fire again for the freshly rendered graph.
    this._flow()?.reset();

    // After this render completes, auto mode measures nodes, runs Dagre, and updates positions via `writeback`.
    this.nodes.set(graph.nodes);
    this.connections.set(graph.connections);
  }

  private _fitToScreen(): void {
    // Fit the viewport after each full render/re-layout cycle.
    this._canvas()?.fitToScreen(PointExtensions.initialize(150, 150), true);
  }
}
