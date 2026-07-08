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
        state.applyCreateConnection(event),
      ),
      draggable.fReassignConnection.subscribe((event: FReassignConnectionEvent) =>
        state.applyReassignConnection(event),
      ),
      draggable.fMoveNodes.subscribe((event: FMoveNodesEvent) => state.applyMoveNodes(event)),
      draggable.fDeleteSelected.subscribe((event: FDeleteSelectedEvent) =>
        state.applyDeleteSelected(event),
      ),
      draggable.fDropToGroup.subscribe((event: FDropToGroupEvent) => state.applyDropToGroup(event)),
      draggable.fCreateNode.subscribe((event: FCreateNodeEvent) => state.applyCreateNode(event)),
      draggable.fSelectionChange.subscribe((event: FSelectionChangeEvent) =>
        state.applySelectionChange(event),
      ),
    );
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
