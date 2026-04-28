import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { F_FLOW, FFlowBase } from './f-flow-base';
import {
  AddFlowToStoreRequest,
  CalculateFlowStateRequest,
  CalculateNodesBoundingBoxNormalizedPositionRequest,
  ClearSelectionRequest,
  COMMON_PROVIDERS,
  GetCurrentSelectionRequest,
  GetNormalizedPointRequest,
  ICurrentSelection,
  IFFlowState,
  IFFlowStateOptions,
  IsDragStartedRequest,
  NotifyFullRenderedRequest,
  NotifyNodesRenderedRequest,
  QueueConnectionRedrawRequest,
  RedrawConnectionsRequest,
  RemoveFlowFromStoreRequest,
  ResetRenderLifecycleRequest,
  SelectAllRequest,
  SelectRequest,
  SortItemLayersRequest,
  WaitForConnectionsRenderedRequest,
} from '../domain';
import { IPoint, IRect } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { F_DRAGGABLE_PROVIDERS, FDraggableDataContext } from '../f-draggable';
import {
  EmitConnectionsChangesRequest,
  FComponentsStore,
  F_STORAGE_PROVIDERS,
  ListenConnectionsChangesRequest,
} from '../f-storage';
import { BrowserService } from '@foblex/platform';
import { afterNextPaint, debounceTime, FChannelHub, notifyOnStart, takeOne } from '../reactivity';
import { ConnectionBehaviourBuilder, ConnectionLineBuilder } from '../f-connection-v2';
import { F_CACHE_OPTIONS } from '../f-cache';
import { F_FLOW_CONFIG } from '../provide-f-flow';
import { F_REFLOW_PROVIDERS } from '../plugins/layout/f-reflow-on-resize';

let uniqueId = 0;
const SORT_ITEM_LAYERS_DEBOUNCE_MS = 120;

@Component({
  selector: 'f-flow',
  templateUrl: './f-flow.component.html',
  styleUrls: ['./f-flow.component.scss'],
  standalone: true,
  host: {
    '[attr.id]': 'fId()',
    class: 'f-component f-flow',
  },
  providers: [
    FMediator,
    ...F_STORAGE_PROVIDERS,
    ConnectionLineBuilder,
    ConnectionBehaviourBuilder,
    ...COMMON_PROVIDERS,
    FDraggableDataContext,
    ...F_DRAGGABLE_PROVIDERS,
    ...F_REFLOW_PROVIDERS,
    { provide: F_FLOW, useExisting: FFlowComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FFlowComponent extends FFlowBase implements OnInit, AfterContentInit, OnDestroy {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _mediator = inject(FMediator);
  private readonly _browser = inject(BrowserService);
  private readonly _componentsStore = inject(FComponentsStore);
  private readonly _cache = inject(F_CACHE_OPTIONS);
  private readonly _injector = inject(Injector);
  private readonly _flowConfig = inject(F_FLOW_CONFIG, { optional: true });

  public override fId = input<string>(this._flowConfig?.id ?? `f-flow-${uniqueId++}`, {
    alias: 'fFlowId',
  });
  public override fCache = input(false, { transform: booleanAttribute });

  public override readonly hostElement = inject(ElementRef).nativeElement;

  public override fNodesRendered = output<string>();

  public override fFullRendered = output<string>();

  /**
   * @deprecated Use `fFullRendered` instead.
   */
  public override fLoaded = output<string>();

  public ngOnInit(): void {
    this._mediator.execute(new AddFlowToStoreRequest(this));
    this._listenCacheChanges();
  }

  public ngAfterContentInit(): void {
    if (!this._browser.isBrowser()) {
      return;
    }
    this._listenNodesChanges();
    this._listenConnectionsChanges();
  }

  public _listenCacheChanges(): void {
    effect(
      () => {
        this._cache.enabled = this.fCache();
      },
      { injector: this._injector },
    );
  }

  private _listenNodesChanges(): void {
    new FChannelHub(
      this._componentsStore.nodesChanges$,
      this._componentsStore.progressiveRenderChanges$,
    )
      .pipe(notifyOnStart(), debounceTime(SORT_ITEM_LAYERS_DEBOUNCE_MS), afterNextPaint())
      .listen(this._destroyRef, () => {
        if (this._mediator.execute(new IsDragStartedRequest())) {
          return;
        }

        if (this._componentsStore.hasPendingProgressiveRender) {
          return;
        }

        this._mediator.execute(new SortItemLayersRequest());
        this._mediator.execute(new NotifyNodesRenderedRequest());
        this._mediator.execute(
          new WaitForConnectionsRenderedRequest(
            this._componentsStore.connectionsRevision + 1,
            this._componentsStore.nodesRevision,
            () => this._mediator.execute(new NotifyFullRenderedRequest()),
            this._destroyRef,
          ),
        );
        this._mediator.execute<void>(new EmitConnectionsChangesRequest());
      });
  }

  private _listenConnectionsChanges(): void {
    this._mediator
      .execute<FChannelHub>(new ListenConnectionsChangesRequest())
      // .pipe(afterNextPaint()) // Removed: caused ~32ms lag on connection redraw. 1ms debounce from ListenConnectionsChanges is sufficient.
      .listen(this._destroyRef, () => {
        if (this._mediator.execute(new IsDragStartedRequest())) {
          return;
        }

        if (this._componentsStore.isViewportAnimating) {
          this._mediator.execute(new QueueConnectionRedrawRequest(this._destroyRef));

          return;
        }

        this._mediator.execute(new RedrawConnectionsRequest());
      });
  }

  public redraw(): void {
    this._mediator.execute(new EmitConnectionsChangesRequest());
  }

  public reset(): void {
    this._mediator.execute(new ResetRenderLifecycleRequest());
  }

  public getNodesBoundingBox(): IRect | null {
    return this._mediator.execute<IRect | null>(
      new CalculateNodesBoundingBoxNormalizedPositionRequest(),
    );
  }

  public getSelection(): ICurrentSelection {
    return this._mediator.execute<ICurrentSelection>(new GetCurrentSelectionRequest());
  }

  public getPositionInFlow(position: IPoint): IRect {
    return this._mediator.execute(new GetNormalizedPointRequest(position));
  }

  public getState(options?: IFFlowStateOptions): IFFlowState {
    return this._mediator.execute(new CalculateFlowStateRequest(options?.measuredSize ?? false));
  }

  public selectAll(): void {
    this._mediator
      .execute<FChannelHub>(new ListenConnectionsChangesRequest())
      .pipe(takeOne())
      .listen(this._destroyRef, () => {
        this._mediator.execute<void>(new SelectAllRequest());
      });
  }

  /**
   * Programmatically selects nodes and connections by their IDs.
   *
   * This method allows external components to control the selection state of the canvas.
   * Selected elements will appear visually highlighted. If `isSelectedChanged` is true,
   * the next user interaction (e.g., clicking the canvas) will emit a selection change event.
   *
   * @param nodes - An array of node IDs to select.
   * @param connections - An array of connection IDs to select.
   * @param isSelectedChanged - Optional. If true (default), marks the selection state as changed,
   * triggering a `fSelectionChange` event on the next user interaction.
   */
  public select(nodes: string[], connections: string[], isSelectedChanged: boolean = true): void {
    this._mediator
      .execute<FChannelHub>(new ListenConnectionsChangesRequest())
      .pipe(takeOne())
      .listen(this._destroyRef, () => {
        this._mediator.execute<void>(new SelectRequest(nodes, connections, isSelectedChanged));
      });
  }

  public clearSelection(): void {
    this._mediator.execute<void>(new ClearSelectionRequest());
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveFlowFromStoreRequest(this));
  }
}
