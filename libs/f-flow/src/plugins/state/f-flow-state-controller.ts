import { effect, inject, Injectable, Injector } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { IPoint, PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../f-storage';
import { FCanvasChangeEvent } from '../../f-canvas';
import {
  FCreateConnectionEvent,
  FCreateNodeEvent,
  FDeleteSelectedEvent,
  FDropToGroupEvent,
  FMoveNodesEvent,
  FReassignConnectionEvent,
  FSelectionChangeEvent,
} from '../../f-draggable';
import { FFlowState, IFStateSelection } from './f-flow-state';
import { F_FLOW_STATE_CONFIG } from './i-f-flow-state';

/**
 * Auto-wiring between the flow's gesture events and `FFlowState` (active only
 * when `withFlowState()` is installed).
 *
 * This is what removes the handler boilerplate: every finished gesture is
 * forwarded into the state's overridable `apply*` methods — the application
 * only loads data and reads it back. Subclass `FFlowState` to change what any
 * gesture means for your data; this controller stays a thin dispatcher.
 */
@Injectable()
export class FFlowStateController {
  private readonly _config = inject(F_FLOW_STATE_CONFIG, { optional: true });
  private readonly _state = inject(FFlowState, { optional: true });
  private readonly _store = inject(FComponentsStore);
  private readonly _browser = inject(BrowserService);
  private readonly _injector = inject(Injector);

  private readonly _disposers: (() => void)[] = [];
  private readonly _subscriptions: { unsubscribe(): void }[] = [];
  /** Per-node/group `sizeChange` subscriptions, keyed by id. */
  private readonly _sizeSubscriptions = new Map<string, { unsubscribe(): void }>();
  private _isWired = false;
  /** The canvas `fCanvasChange` subscription is in place. */
  private _isCanvasWired = false;
  /** A state transaction is currently open (beginBatch without endBatch). */
  private _batchActive = false;
  /** Inside a drag session (fDragStarted → fDragEnded). */
  private _dragActive = false;
  /** Canvas transform captured at drag start, to detect a change during the drag. */
  private _dragStartTransform: { position: IPoint; scale: number } | null = null;
  /** Latest canvas transform awaiting a (possibly debounced) capture. */
  private _pendingTransform: { position: IPoint; scale: number } | null = null;
  private _transformDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  /** A microtask is queued to close a non-drag batch at the end of the tick. */
  private _closeScheduled = false;

  /** Called once by `FFlowComponent` after content init (browser only). */
  public initialize(): void {
    if (!this._config || !this._state || !this._browser.isBrowser()) {
      return;
    }

    this._state._connectorOwnerResolver = (connectorId) => this._resolveOwnerNode(connectorId);
    this._state._onUndoToStart = () => this._resetAndRenderFlow();

    this._wireDraggableEvents();
    this._wireCanvasEvents();
    this._wireSizeChanges();
    // The draggable directive, canvas and nodes/groups register over time;
    // re-wire on every registry change (`_wire*` are idempotent).
    this._disposers.push(
      this._store.nodesChanges$.listen(() => {
        this._wireDraggableEvents();
        this._wireCanvasEvents();
        this._wireSizeChanges();
      }),
    );

    if (this._config.selectionInHistory) {
      this._wireSelectionRestore();
    }
  }

  public destroy(): void {
    this._disposers.forEach((dispose) => dispose());
    this._disposers.length = 0;
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this._subscriptions.length = 0;
    this._sizeSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this._sizeSubscriptions.clear();
    if (this._transformDebounceTimer !== null) {
      clearTimeout(this._transformDebounceTimer);
      this._transformDebounceTimer = null;
    }
    this._pendingTransform = null;
    this._isWired = false;
    this._isCanvasWired = false;
    this._dragActive = false;
    this._closeScheduled = false;
    this._closeBatch();
    if (this._state) {
      this._state._connectorOwnerResolver = null;
      this._state._onUndoToStart = null;
    }
  }

  private _wireDraggableEvents(): void {
    const draggable = this._store.fDraggable;
    if (this._isWired || !draggable) {
      return;
    }
    this._isWired = true;

    const state = this._state as FFlowState;

    this._subscriptions.push(
      draggable.fCreateConnection.subscribe((event: FCreateConnectionEvent) =>
        this._dispatch(() => state.applyCreateConnection(event)),
      ),
      draggable.fReassignConnection.subscribe((event: FReassignConnectionEvent) =>
        this._dispatch(() => state.applyReassignConnection(event)),
      ),
      draggable.fMoveNodes.subscribe((event: FMoveNodesEvent) =>
        this._dispatch(() => state.applyMoveNodes(event)),
      ),
      draggable.fDeleteSelected.subscribe((event: FDeleteSelectedEvent) =>
        this._dispatch(() => state.applyDeleteSelected(event)),
      ),
      draggable.fDropToGroup.subscribe((event: FDropToGroupEvent) =>
        this._dispatch(() => state.applyDropToGroup(event)),
      ),
      draggable.fCreateNode.subscribe((event: FCreateNodeEvent) =>
        this._dispatch(() => state.applyCreateNode(event)),
      ),
      draggable.fSelectionChange.subscribe((event: FSelectionChangeEvent) =>
        this._dispatch(() => state.applySelectionChange(event)),
      ),
      // Drag lifecycle brackets the batch across ticks: the drag-start
      // selection and the pointer-up move live in different ticks, so the
      // batch must survive the gap between them.
      draggable.fDragStarted.subscribe(() => this._onDragStarted()),
      draggable.fDragEnded.subscribe(() => this._onDragEnded()),
    );
  }

  /**
   * Captures canvas pan/zoom (`fCanvasChange`) into the state. Routed through
   * `_dispatch` so a pan-drag folds into one step. Restore is binding-driven:
   * bind the canvas `[position]`/`[scale]` to `state.transform()` and undo/redo
   * flows back through the guarded input path — no imperative push needed.
   */
  private _wireCanvasEvents(): void {
    const canvas = this._store.fCanvas;
    if (this._isCanvasWired || !canvas) {
      return;
    }
    this._isCanvasWired = true;

    this._subscriptions.push(
      canvas.fCanvasChange.subscribe((event: FCanvasChangeEvent) => this._onCanvasChange(event)),
    );
  }

  /**
   * Records a canvas pan/zoom, optionally debounced (`canvasTransformDebounce`)
   * so a zoom/pan burst collapses into one step once it settles.
   */
  private _onCanvasChange(event: FCanvasChangeEvent): void {
    this._pendingTransform = { position: event.position, scale: event.scale };

    const debounce = this._config?.canvasTransformDebounce ?? 0;
    if (debounce <= 0) {
      if (this._transformDebounceTimer !== null) {
        clearTimeout(this._transformDebounceTimer);
        this._transformDebounceTimer = null;
      }
      this._flushCanvasChange();

      return;
    }

    if (this._transformDebounceTimer !== null) {
      clearTimeout(this._transformDebounceTimer);
    }
    this._scheduleCanvasChangeFlush(debounce);
  }

  private _flushCanvasChange(): void {
    const pending = this._pendingTransform;
    if (!pending) {
      return;
    }

    const current = this._readCanvasTransform();
    const debounce = this._config?.canvasTransformDebounce ?? 0;
    if (debounce > 0 && current && !this._isSameCanvasTransform(pending, current)) {
      this._pendingTransform = current;
      this._scheduleCanvasChangeFlush(debounce);

      return;
    }

    this._pendingTransform = null;
    const settled = debounce > 0 ? (current ?? pending) : pending;
    this._dispatch(() => (this._state as FFlowState).applyTransform(settled));
  }

  private _scheduleCanvasChangeFlush(debounce: number): void {
    this._transformDebounceTimer = setTimeout(() => {
      this._transformDebounceTimer = null;
      this._flushCanvasChange();
    }, debounce);
  }

  private _isSameCanvasTransform(
    first: { position: IPoint; scale: number },
    second: { position: IPoint; scale: number },
  ): boolean {
    return (
      first.position.x === second.position.x &&
      first.position.y === second.position.y &&
      first.scale === second.scale
    );
  }

  /**
   * Subscribes to every node's and group's `sizeChange` (a per-directive
   * output, not a draggable event) so a resize — most often a group
   * auto-fitting after a child was added — is folded into the last history
   * step via `applyResize`. Re-runs as nodes/groups register; drops removed.
   */
  private _wireSizeChanges(): void {
    const state = this._state as FFlowState;
    const alive = new Set<string>();

    for (const node of this._store.nodes.getAll()) {
      const id = node.fId();
      alive.add(id);
      if (!this._sizeSubscriptions.has(id)) {
        this._sizeSubscriptions.set(
          id,
          node.sizeChange.subscribe((rect) => state.applyResize(id, rect)),
        );
      }
    }

    for (const [id, subscription] of this._sizeSubscriptions) {
      if (!alive.has(id)) {
        subscription.unsubscribe();
        this._sizeSubscriptions.delete(id);
      }
    }
  }

  /**
   * Folds every event of one drag session into a single undoable step.
   *
   * The events don't share a tick: the selection change is emitted at drag
   * START (before `fDragStarted`), while the move / drop-to-group land at drag
   * END (pointer-up). So the batch opens on the first event of the tick and,
   * once `fDragStarted` marks a drag in progress, stays open until `fDragEnded`
   * — spanning the whole drag. Outside a drag (e.g. a keyboard delete) it
   * closes on the next microtask, so unrelated same-tick bursts still collapse.
   * Programmatic app mutations don't run through here, so they stay separate.
   */
  private _dispatch(apply: () => void): void {
    this._openBatch();
    if (!this._dragActive && !this._closeScheduled) {
      this._closeScheduled = true;
      queueMicrotask(() => {
        this._closeScheduled = false;
        if (!this._dragActive) {
          this._closeBatch();
        }
      });
    }
    apply();
  }

  private _onDragStarted(): void {
    this._dragActive = true;
    // The leading selection has usually opened the batch already; if not
    // (e.g. dragging an already-selected node), open it now.
    this._openBatch();
    this._dragStartTransform = this._readCanvasTransform();
  }

  private _onDragEnded(): void {
    this._dragActive = false;
    // Fold any canvas transform change from this drag (auto-pan, or a mid-drag
    // zoom) into the same step. `fCanvasChange` is debounced onto a macrotask,
    // so it arrives AFTER this handler has closed the batch — read the settled
    // transform straight from the canvas now instead. The later `fCanvasChange`
    // carrying the same value is a no-op (`applyTransform` skips it).
    this._captureCanvasTransform();
    this._closeBatch();
    this._dragStartTransform = null;
  }

  /** The canvas transform right now, or `null` when there is no canvas. */
  private _readCanvasTransform(): { position: IPoint; scale: number } | null {
    const canvas = this._store.fCanvas;
    if (!canvas) {
      return null;
    }

    const transform = canvas.transform;

    return {
      position: PointExtensions.sum(transform.position, transform.scaledPosition),
      scale: transform.scale,
    };
  }

  /**
   * Folds a drag's canvas transform into its step, but only when the transform
   * actually moved during the drag. A plain node drag leaves the canvas alone,
   * so we must NOT capture it — that would solidify an as-yet-unset (undefined)
   * position to the origin.
   */
  private _captureCanvasTransform(): void {
    const state = this._state as FFlowState;
    const current = this._readCanvasTransform();
    const start = this._dragStartTransform;
    if (
      !current ||
      !start ||
      (current.position.x === start.position.x &&
        current.position.y === start.position.y &&
        current.scale === start.scale)
    ) {
      return;
    }

    state._initializeTransform(start);
    state.applyTransform(current);
  }

  private _openBatch(): void {
    if (!this._batchActive) {
      this._batchActive = true;
      (this._state as FFlowState).beginBatch();
    }
  }

  private _closeBatch(): void {
    if (this._batchActive) {
      this._batchActive = false;
      (this._state as FFlowState).endBatch();
    }
  }

  /**
   * When selection is part of the history, `undo`/`redo` land on a shape with
   * its own selection — push it back into the flow so the highlight follows.
   * `isSelectedChanged: false` keeps this from re-emitting a selection change.
   */
  private _wireSelectionRestore(): void {
    const state = this._state as FFlowState;
    const ref = effect(
      () => {
        const selection = state.selection();
        this._restoreSelection(selection);
      },
      { injector: this._injector },
    );
    this._disposers.push(() => ref.destroy());
  }

  private _restoreSelection(selection: IFStateSelection): void {
    this._store.fFlow?.select(
      [...selection.nodeIds, ...selection.groupIds],
      selection.connectionIds,
      false,
    );
  }

  /** Resets lifecycle flags and starts a render pass for the restored initial state. */
  private _resetAndRenderFlow(): void {
    const flow = this._store.fFlow;
    if (!flow) {
      return;
    }

    flow.reset();
    this._store.emitNodeChanges();
  }

  private _resolveOwnerNode(connectorId: string): string | undefined {
    const connector =
      this._store.connectors.get(connectorId) ??
      this._store.outputs.get(connectorId) ??
      this._store.inputs.get(connectorId) ??
      this._store.outlets.get(connectorId);

    return connector?.fNodeId;
  }
}
