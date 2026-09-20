/**
 * Emitted by `<f-snap-connection>` when the snapped target changes during a
 * connection-creation gesture. `targetId` is the connector currently within
 * `fSnapThreshold`, or `undefined` when the snap is released or the gesture
 * ends — so both endpoints can be styled while the snap preview is shown.
 */
export class FSnapTargetChangeEvent {
  constructor(
    public readonly sourceId: string,
    public readonly targetId: string | undefined,
  ) {}
}
