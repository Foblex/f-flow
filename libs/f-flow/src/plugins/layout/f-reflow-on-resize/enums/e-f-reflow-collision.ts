/**
 * Behavior when a candidate node would collide with a non-candidate during shift.
 *
 * - `STOP` — shift stops at the first collision, respecting the configured gap.
 *   Remaining delta is discarded.
 * - `CHAIN_PUSH` — the colliding non-candidate is absorbed into the plan and
 *   recursively pushed. Bounded by `maxCascadeDepth`.
 */
export enum EFReflowCollision {
  STOP = 'stop',
  CHAIN_PUSH = 'chain-push',
}
