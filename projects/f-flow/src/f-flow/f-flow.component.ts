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
  RedrawConnectionsRequest,
  RemoveFlowFromStoreRequest,
  SelectAllRequest,
  SelectRequest,
  SortItemLayersRequest,
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
import { F_CONNECTION_WORKER_FEATURES, FConnectionWorker } from '../f-connection-worker';

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
    ...F_CONNECTION_WORKER_FEATURES,
    ConnectionLineBuilder,
    ConnectionBehaviourBuilder,
    ...COMMON_PROVIDERS,
    FDraggableDataContext,
    ...F_DRAGGABLE_PROVIDERS,
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
  private readonly _worker = inject(FConnectionWorker);

  public override fId = input<string>(`f-flow-${uniqueId++}`, { alias: 'fFlowId' });
  public override fCache = input(false, { transform: booleanAttribute });

  public override readonly hostElement = inject(ElementRef).nativeElement;

  public override fLoaded = output<string>();

  private _isLoaded: boolean = false;

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
        this._mediator.execute<void>(new EmitConnectionsChangesRequest());

        this._emitLoaded();
      });
  }

  private _listenConnectionsChanges(): void {
    this._mediator
      .execute<FChannelHub>(new ListenConnectionsChangesRequest())
      .pipe(afterNextPaint())
      .listen(this._destroyRef, () => {
        if (this._mediator.execute(new IsDragStartedRequest())) {
          return;
        }

        this._mediator.execute(new RedrawConnectionsRequest());
      });
  }

  private _emitLoaded(): void {
    if (!this._isLoaded) {
      this._isLoaded = true;
      this.fLoaded.emit(this.fId());
    }
  }

  public redraw(): void {
    this._mediator.execute(new EmitConnectionsChangesRequest());
  }

  public reset(): void {
    this._isLoaded = false;
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
    this._worker.dispose();
    this._mediator.execute(new RemoveFlowFromStoreRequest(this));
  }
}
