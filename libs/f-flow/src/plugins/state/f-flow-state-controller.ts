import { effect, inject, Injectable, Injector } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { FComponentsStore } from '../../f-storage';
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
  private _isWired = false;
  /** A state transaction is currently open (beginBatch without endBatch). */
  private _batchActive = false;
  /** Inside a drag session (fDragStarted → fDragEnded). */
  private _dragActive = false;
  /** A microtask is queued to close a non-drag batch at the end of the tick. */
  private _closeScheduled = false;

  /** Called once by `FFlowComponent` after content init (browser only). */
  public initialize(): void {
    if (!this._config || !this._state || !this._browser.isBrowser()) {
      return;
    }

    this._state._connectorOwnerResolver = (connectorId) => this._resolveOwnerNode(connectorId);

    this._wireDraggableEvents();
    if (!this._isWired) {
      // The draggable directive may register after this controller.
      this._disposers.push(this._store.nodesChanges$.listen(() => this._wireDraggableEvents()));
    }

    if (this._config.selectionInHistory) {
      this._wireSelectionRestore();
    }
  }

  public destroy(): void {
    this._disposers.forEach((dispose) => dispose());
    this._disposers.length = 0;
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this._subscriptions.length = 0;
    this._isWired = false;
    this._dragActive = false;
    this._closeScheduled = false;
    this._closeBatch();
    if (this._state) {
      this._state._connectorOwnerResolver = null;
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
  }

  private _onDragEnded(): void {
    this._dragActive = false;
    this._closeBatch();
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

  private _resolveOwnerNode(connectorId: string): string | undefined {
    const connector =
      this._store.connectors.get(connectorId) ??
      this._store.outputs.get(connectorId) ??
      this._store.inputs.get(connectorId) ??
      this._store.outlets.get(connectorId);

    return connector?.fNodeId;
  }
}
