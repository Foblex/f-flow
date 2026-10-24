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
  ViewEncapsulation,
} from '@angular/core';
import { F_FLOW, FFlowBase } from './f-flow-base';
import {
  AddFlowToStoreRequest,
  CalculateFlowStateRequest,
  CalculateNodesBoundingBoxNormalizedPositionRequest,
  ClearSelectionRequest,
  COMMON_PROVIDERS,
  DisposeConnectionWorkerRequest,
  GetCurrentSelectionRequest,
  GetNormalizedPointRequest,
  fWarnOnce,
  ICurrentSelection,
  IFFlowState,
  IFFlowStateOptions,
  isFDevMode,
  IsDragStartedRequest,
  NotifyFullRenderedRequest,
  NotifyNodesRenderedRequest,
  QueueConnectionRedrawRequest,
  RedrawConnectionsRequest,
  RemoveFlowFromStoreRequest,
  RunDevDiagnosticsRequest,
  ResetRenderLifecycleRequest,
  SelectAllRequest,
  SelectRequest,
  SortItemLayersRequest,
  WaitForConnectionsRenderedRequest,
} from '../domain';
import { IPoint, IRect } from '../_libs/f-2d';
import { FMediator } from '../_libs/f-mediator';
import { F_DRAGGABLE_PROVIDERS, FDraggableDataContext } from '../f-draggable';
import {
  EmitConnectionsChangesRequest,
  FComponentsStore,
  F_STORAGE_PROVIDERS,
  ListenConnectionsChangesRequest,
} from '../f-storage';
import { BrowserService } from '../_libs/f-platform';
import { afterNextPaint, FChannelHub, notifyOnStart, takeOne } from '../reactivity';
import { ConnectionBehaviourBuilder, ConnectionLineBuilder } from '../f-connection-v2';
import { F_CACHE_OPTIONS } from '../f-cache';
import { F_FLOW_CONFIG } from '../provide-f-flow';
import { F_REFLOW_PROVIDERS } from '../plugins/layout/f-reflow-on-resize';
import { FA11yAnnouncer, FA11yController } from '../plugins/a11y';
import { FFlowStateController } from '../plugins/state';

let uniqueId = 0;

// grace for flows whose data arrives asynchronously shortly after init: while the store
// is empty and this window is open, the pass defers instead of latching the one-shot
// lifecycle events (fNodesRendered/fFullRendered/fLoaded) on an empty canvas; a
// legitimately empty flow completes its lifecycle once the window closes
const EMPTY_FLOW_LIFECYCLE_GRACE_MS = 120;

// dev diagnostics inspect the settled state, not the intermediate ones a burst of
// passes walks through — they run behind their own settle window
const DEV_DIAGNOSTICS_SETTLE_MS = 120;

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
    FA11yAnnouncer,
    FA11yController,
    FFlowStateController,
    { provide: F_FLOW, useExisting: FFlowComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FFlowComponent extends FFlowBase implements OnInit, AfterContentInit, OnDestroy {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _mediator = inject(FMediator);
  private readonly _browser = inject(BrowserService);
  private readonly _componentsStore = inject(FComponentsStore);
  private readonly _cache = inject(F_CACHE_OPTIONS);
  private readonly _injector = inject(Injector);
  private readonly _flowConfig = inject(F_FLOW_CONFIG, { optional: true });
  private readonly _a11y = inject(FA11yController);
  private readonly _flowState = inject(FFlowStateController);

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
    this._a11y.initialize();
    this._flowState.initialize();
    this._warnWhenHostHasNoHeight();
  }

  /**
   * A zero-height host is the most common "blank canvas" mistake — everything compiles
   * and renders, but nothing is visible. Checked once after the first paint.
   */
  private _warnWhenHostHasNoHeight(): void {
    if (!isFDevMode()) {
      return;
    }

    requestAnimationFrame(() => {
      if (this.hostElement.clientHeight === 0) {
        fWarnOnce(
          'FF1002',
          this.fId(),
          `<f-flow> "${this.fId()}" has zero height, so the flow is invisible. Give it a height, e.g. "f-flow { display: block; height: 600px; }".`,
        );
      }
    });
  }

  public _listenCacheChanges(): void {
    effect(
      () => {
        this._cache.enabled = this.fCache();
      },
      { injector: this._injector },
    );
  }

  private _emptyBootstrapGraceTimer: ReturnType<typeof setTimeout> | null = null;
  private _isEmptyBootstrapGraceElapsed = false;
  private _devDiagnosticsTimer: ReturnType<typeof setTimeout> | null = null;

  private _listenNodesChanges(): void {
    this._destroyRef.onDestroy(() => {
      if (this._emptyBootstrapGraceTimer !== null) clearTimeout(this._emptyBootstrapGraceTimer);
      if (this._devDiagnosticsTimer !== null) clearTimeout(this._devDiagnosticsTimer);
    });

    // no wall-clock debounce here: the store coalesces a burst of node registrations into
    // one notification per microtask, and afterNextPaint restarts its double-rAF on every
    // notification, so same-frame batches merge into one pass; correctness is held by the
    // guards below and the connection revisions
    new FChannelHub(
      this._componentsStore.nodesChanges$,
      this._componentsStore.progressiveRenderChanges$,
    )
      .pipe(notifyOnStart(), afterNextPaint())
      .listen(this._destroyRef, () => this._runNodesPass());
  }

  private _runNodesPass(): void {
    if (this._mediator.execute(new IsDragStartedRequest())) {
      // EmitEndDragSequenceEvent re-emits node changes for this flag, so the
      // skipped pass runs right after pointer-up instead of being lost
      this._componentsStore.hasPendingNodesPassAfterDrag = true;

      return;
    }

    if (this._componentsStore.hasPendingProgressiveRender) {
      return;
    }

    if (!this._componentsStore.nodes.getAll().length && !this._isEmptyBootstrapGraceElapsed) {
      this._emptyBootstrapGraceTimer ??= setTimeout(() => {
        this._isEmptyBootstrapGraceElapsed = true;
        this._emptyBootstrapGraceTimer = null;
        this._componentsStore.emitNodeChanges();
      }, EMPTY_FLOW_LIFECYCLE_GRACE_MS);

      return;
    }

    if (this._emptyBootstrapGraceTimer !== null) {
      clearTimeout(this._emptyBootstrapGraceTimer);
      this._emptyBootstrapGraceTimer = null;
    }
    this._isEmptyBootstrapGraceElapsed = true;

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
    this._mediator.execute(new EmitConnectionsChangesRequest());
    this._scheduleDevDiagnostics();
  }

  private _scheduleDevDiagnostics(): void {
    if (!isFDevMode()) {
      return;
    }
    if (this._devDiagnosticsTimer !== null) {
      clearTimeout(this._devDiagnosticsTimer);
    }
    this._devDiagnosticsTimer = setTimeout(() => {
      this._devDiagnosticsTimer = null;
      this._mediator.execute(new RunDevDiagnosticsRequest());
    }, DEV_DIAGNOSTICS_SETTLE_MS);
  }

  private _listenConnectionsChanges(): void {
    this._mediator
      .execute(new ListenConnectionsChangesRequest())
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
    return this._mediator.execute(new CalculateNodesBoundingBoxNormalizedPositionRequest());
  }

  public getSelection(): ICurrentSelection {
    return this._mediator.execute(new GetCurrentSelectionRequest());
  }

  /**
   * Converts a client-space point into flow coordinates. Earlier versions declared
   * `IRect` here by mistake - the returned value never had width or height.
   */
  public getPositionInFlow(position: IPoint): IPoint {
    return this._mediator.execute(new GetNormalizedPointRequest(position));
  }

  public getState(options?: IFFlowStateOptions): IFFlowState {
    return this._mediator.execute(new CalculateFlowStateRequest(options?.measuredSize ?? false));
  }

  public selectAll(): void {
    this._mediator
      .execute(new ListenConnectionsChangesRequest())
      .pipe(takeOne())
      .listen(this._destroyRef, () => {
        this._mediator.execute(new SelectAllRequest());
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
      .execute(new ListenConnectionsChangesRequest())
      .pipe(takeOne())
      .listen(this._destroyRef, () => {
        this._mediator.execute(new SelectRequest(nodes, connections, isSelectedChanged));
      });
  }

  public clearSelection(): void {
    this._mediator.execute(new ClearSelectionRequest());
  }

  public ngOnDestroy(): void {
    this._a11y.destroy();
    this._flowState.destroy();
    this._mediator.execute(new DisposeConnectionWorkerRequest());
    this._mediator.execute(new RemoveFlowFromStoreRequest(this));
  }
}
