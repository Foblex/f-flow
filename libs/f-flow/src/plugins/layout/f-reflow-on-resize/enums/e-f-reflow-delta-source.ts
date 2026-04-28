/**
 * How the delta between baseline and next rect is interpreted when shifting candidates.
 *
 * - `EDGE_BASED` (recommended) — the edge that actually moved drives the shift:
 *   nodes below the resizing node follow the bottom edge delta, nodes above
 *   follow the top edge delta. Correct under asymmetric resize (top-handle,
 *   bottom-handle, corner handles).
 * - `CENTER_BASED` — the whole delta is applied to candidates selected by
 *   center-line comparison. Simpler, but can misshift under asymmetric resize.
 */
export enum EFReflowDeltaSource {
  EDGE_BASED = 'edge-based',
  CENTER_BASED = 'center-based',
}
