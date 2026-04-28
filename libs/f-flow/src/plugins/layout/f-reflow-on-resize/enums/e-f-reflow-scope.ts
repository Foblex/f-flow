/**
 * Which subset of the graph participates in a reflow plan.
 *
 * - `GLOBAL` — every node and group on the canvas.
 * - `GROUP` — only siblings sharing the resizing node's `fParentId`.
 * - `CONNECTED_SUBGRAPH` — only nodes in the same connected component
 *   (BFS over connections in both directions).
 */
export enum EFReflowScope {
  GLOBAL = 'global',
  GROUP = 'group',
  CONNECTED_SUBGRAPH = 'connected-subgraph',
}
