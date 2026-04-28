/**
 * Strategy for selecting which nodes are shifted when a node resizes.
 *
 * - `CENTER_OF_MASS` — every node whose geometric center lies beyond the
 *   resizing node's center along the resize axis is a candidate. Simplest,
 *   global default.
 * - `X_RANGE` — like `CENTER_OF_MASS`, but narrowed to nodes whose
 *   perpendicular span overlaps the resizing node. Useful for column-style
 *   layouts.
 * - `DOWNSTREAM_CONNECTIONS` — only nodes reachable via outgoing connections
 *   are candidates; geometric filter applies on top. Cycles are detected.
 */
export enum EFReflowMode {
  CENTER_OF_MASS = 'center-of-mass',
  X_RANGE = 'x-range',
  DOWNSTREAM_CONNECTIONS = 'downstream-connections',
}
