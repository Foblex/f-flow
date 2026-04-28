/**
 * Axes along which reflow responds to a resize.
 *
 * When `BOTH`, the planner runs the vertical and horizontal passes
 * independently against the same baseline; the axis-order of application
 * is therefore commutative.
 */
export enum EFReflowAxis {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  BOTH = 'both',
}
