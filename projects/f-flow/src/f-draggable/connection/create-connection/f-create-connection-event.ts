import { IPoint } from '@foblex/2d';

export class FCreateConnectionEvent {
  // -----------------------------
  // Preferred API
  // -----------------------------

  /** Source connector id */
  public readonly sourceId: string;

  /** Target connector id (can be undefined if dropped to nowhere) */
  public readonly targetId: string | undefined;

  /** Pointer position where the user dropped pointer. */
  public readonly dropPosition: IPoint;

  // -----------------------------
  // Deprecated compatibility API (keep as FIELDS)
  // -----------------------------

  /** @deprecated Use `sourceId` */
  public readonly fOutputId: string;

  /** @deprecated Use `targetId` */
  public readonly fInputId: string | undefined;

  /** @deprecated Use `dropPosition` */
  public readonly fDropPosition: IPoint;

  constructor(sourceId: string, targetId: string | undefined, dropPosition: IPoint) {
    // preferred
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.dropPosition = dropPosition;

    // legacy aliases
    this.fOutputId = sourceId;
    this.fInputId = targetId;
    this.fDropPosition = dropPosition;
  }
}
