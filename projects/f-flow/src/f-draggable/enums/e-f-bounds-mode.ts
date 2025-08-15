/**
 * Defines how node bounds are handled when dragging multiple nodes together.
 */
export enum EFBoundsMode {
  /**
   * Stops the entire group from moving further
   * as soon as any single node reaches its container bounds.
   */
  HaltOnAnyHit,

  /**
   * Clamps only the nodes that reach their container bounds,
   * allowing other nodes in the group to continue moving.
   */
  ClampIndividually,
}
