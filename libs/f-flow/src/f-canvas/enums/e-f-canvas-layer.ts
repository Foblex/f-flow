/**
 * Built-in layers rendered inside `<f-canvas>`. Each one corresponds to
 * a sibling container in the canvas template (groups, connections,
 * nodes) and gets its own z-index based on its position in the order
 * passed to `<f-canvas [fLayers]>` or `withFCanvas({ layers })`.
 *
 * The order of an array of `EFCanvasLayer` values is read **bottom to top**:
 * the first entry sits underneath, the last entry sits on top.
 */
export enum EFCanvasLayer {
  GROUPS = 'groups',
  CONNECTIONS = 'connections',
  NODES = 'nodes',
}
