import { FEventTrigger } from '../../../domain';

/**
 * A fully-resolved control scheme: the complete mapping between input gestures and canvas
 * actions. Every field is required; the injection token always resolves to this shape.
 *
 * Each pointer field is an `FEventTrigger` predicate `(event) => boolean` evaluated when
 * the matching interaction is about to start; `scrollPan` routes the mouse wheel.
 *
 * Multi-select, double-click zoom, external items and connection waypoints stay on their
 * dedicated inputs and are not part of the scheme.
 *
 * Provide a scheme (or a partial override of one) through
 * `provideFFlow(withControlScheme(...))`; see {@link F_DEFAULT_CONTROL_SCHEME},
 * {@link F_SCROLL_PAN_CONTROL_SCHEME} and {@link F_DRAG_SELECT_CONTROL_SCHEME}.
 */
export interface IFControlScheme {
  /** Starts dragging a node. */
  readonly nodeMove: FEventTrigger;
  /**
   * Starts panning the canvas by dragging. The middle mouse button reaches the drag
   * pipeline only when this gesture accepts it.
   */
  readonly canvasMove: FEventTrigger;
  /** Activates the `<f-selection-area>` selection rectangle. */
  readonly selection: FEventTrigger;
  /** Starts creating a connection from a connector. */
  readonly createConnection: FEventTrigger;
  /** Starts reassigning an existing connection endpoint. */
  readonly reassignConnection: FEventTrigger;
  /** Starts resizing a node from a resize handle. */
  readonly nodeResize: FEventTrigger;
  /** Starts rotating a node from a rotate handle. */
  readonly nodeRotate: FEventTrigger;
  /** When `true`, a plain wheel / two-finger scroll pans; `Ctrl`/`Cmd`+wheel or pinch zooms. */
  readonly scrollPan: boolean;
  /** Allows the wheel to zoom (applies while `scrollPan` is off, or with `Ctrl`/`Cmd`). */
  readonly zoom: FEventTrigger;
}

/**
 * Partial control scheme accepted by `withControlScheme(...)` and
 * `FControlSchemeController.setScheme(...)`. Missing gestures fall back to
 * {@link F_DEFAULT_CONTROL_SCHEME}, so a scheme can start from a preset and override a
 * single gesture.
 */
export interface IFControlSchemeConfig {
  nodeMove?: FEventTrigger;
  canvasMove?: FEventTrigger;
  selection?: FEventTrigger;
  createConnection?: FEventTrigger;
  reassignConnection?: FEventTrigger;
  nodeResize?: FEventTrigger;
  nodeRotate?: FEventTrigger;
  scrollPan?: boolean;
  zoom?: FEventTrigger;
}
