import { InjectionToken, Type } from '@angular/core';
import type { FCreateConnectionEvent, FCreateNodeEvent } from '../../f-draggable';
import type { FFlowState } from './f-flow-state';
import { IFStateConnection, IFStateNode } from './i-f-state-models';

/**
 * Configuration of the state plugin, installed via
 * `provideFFlow(withFlowState(...))`.
 */
export interface IFFlowStateConfig {
  /** How many steps the undo history keeps. Default `50`. */
  historyLimit?: number;

  /**
   * Whether a selection change is its own undoable step. On by default —
   * `undo`/`redo` also walk selection (Figma/Photoshop style), and a drag's
   * leading selection folds into the same step as the move. Set `false` to
   * keep selection out of the history (like xyflow or tldraw);
   * `state.selection()` reflects the current selection either way.
   */
  selectionInHistory?: boolean;

  /**
   * Whether dropping into a group reparents the dropped item (or nests an
   * external item). Off by default — the state ignores group membership: a
   * drop-to-group gesture is a no-op and an external item dropped over a group
   * lands at the top level instead of nested. Set `true` to opt into grouping.
   */
  dropToGroup?: boolean;

  /**
   * Your own store subclass. Every `FFlowState` method — CRUD, the `apply*`
   * gesture handlers, the protected building blocks — is overridable, and the
   * auto-wiring dispatches through this class, so an override changes what a
   * gesture means for your data.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateClass?: Type<FFlowState<any, any, any>>;

  /**
   * Builds the connection record when the user finishes a create-connection
   * gesture. Return `null` to reject the connection. Defaults to a generated
   * id with the gesture's endpoints.
   */
  connectionFactory?: (event: FCreateConnectionEvent) => IFStateConnection | null;

  /**
   * Builds the node record when an external item is dropped onto the canvas.
   * Return `null` to reject the drop. Defaults to a generated id at the drop
   * position with the external item's payload as `data`.
   */
  nodeFactory?: (event: FCreateNodeEvent) => IFStateNode | null;
}

export interface IFFlowStateResolvedConfig extends IFFlowStateConfig {
  historyLimit: number;
  selectionInHistory: boolean;
  dropToGroup: boolean;
}

export function mergeFlowStateConfig(config?: IFFlowStateConfig): IFFlowStateResolvedConfig {
  return {
    historyLimit: 50,
    selectionInHistory: true,
    dropToGroup: false,
    ...config,
  };
}

/**
 * Resolved state-plugin configuration. Present in the injector only when
 * `withFlowState()` is installed — its absence keeps `FFlowStateController`
 * inert.
 */
export const F_FLOW_STATE_CONFIG = new InjectionToken<IFFlowStateResolvedConfig>(
  'F_FLOW_STATE_CONFIG',
);
