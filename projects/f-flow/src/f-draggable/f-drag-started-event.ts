export class FDragStartedEvent<TData = unknown> {
  /** New identifier (can differ from legacy). */
  public readonly kind: string;

  /** Payload. */
  public readonly data?: TData;

  /**
   * Legacy identifier.
   * Kept as own property to preserve Object.keys / hasOwnProperty / spread behavior.
   * @deprecated Use `kind`
   */
  public readonly fEventType: string;

  /** @deprecated Use `data` */
  public get fData(): TData | undefined {
    return this.data;
  }

  constructor(kind: string, data?: TData, legacyKind?: string) {
    this.kind = kind;
    this.data = data;

    // own property (max compatibility)
    this.fEventType = legacyKind ?? kind;
  }
}
