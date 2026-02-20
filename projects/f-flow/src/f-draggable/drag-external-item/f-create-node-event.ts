import { IPoint, IRect } from '@foblex/2d';

export class FCreateNodeEvent<TData = never> {
  // -----------------------------
  // Preferred API
  // -----------------------------

  /** Rect of the dragged external item at the moment of drop (in flow coordinates). */
  public readonly externalItemRect: IRect;

  /** External item data payload. */
  public readonly data: TData;

  /** Id of node/group where item was dropped (if any). */
  public readonly targetContainerId?: string;

  /** Pointer drop position in flow coordinates (if provided). */
  public readonly dropPosition?: IPoint;

  // -----------------------------
  // Deprecated compatibility API
  // -----------------------------

  /** @deprecated Use `externalItemRect` */
  public readonly rect: IRect;

  /** @deprecated Use `targetContainerId` */
  public readonly fTargetNode?: string;

  /** @deprecated Use `dropPosition` */
  public readonly fDropPosition?: IPoint;

  constructor(
    externalItemRect: IRect,
    data: TData,
    targetContainerId?: string,
    dropPosition?: IPoint,
  ) {
    // new
    this.externalItemRect = externalItemRect;
    this.data = data;
    this.targetContainerId = targetContainerId;
    this.dropPosition = dropPosition;

    // legacy aliases (same values / references)
    this.rect = externalItemRect;
    this.fTargetNode = targetContainerId;
    this.fDropPosition = dropPosition;
  }
}
