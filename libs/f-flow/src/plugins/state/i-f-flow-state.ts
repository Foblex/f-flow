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
   * Whether a selection change is its own undoable step. Off by default —
   * selecting nodes/connections does not touch the history (like xyflow or
   * tldraw). Turn on for editors where `undo` should also walk selection
   * (Figma/Photoshop style); `state.selection()` reflects the current
   * selection either way.
   */
  selectionInHistory?: boolean;

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
}

export function mergeFlowStateConfig(config?: IFFlowStateConfig): IFFlowStateResolvedConfig {
  return {
    historyLimit: 50,
    selectionInHistory: false,
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
