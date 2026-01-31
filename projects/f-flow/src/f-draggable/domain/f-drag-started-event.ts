export class FDragStartedEvent<TData = unknown> {
  /** New identifier (can differ from legacy). */
  public readonly kind: string;

  /** Payload. */
  public readonly data?: TData;

  /** Old identifier (kept for backward compatibility). */
  private readonly _legacyKind: string;

  /** @deprecated Use `kind` */
  public get fEventType(): string {
    return this._legacyKind;
  }

  /** @deprecated Use `data` */
  public get fData(): TData | undefined {
    return this.data;
  }

  constructor(kind: string, data?: TData, legacyKind?: string) {
    this.kind = kind;
    this.data = data;
    this._legacyKind = legacyKind ?? kind;
  }
}
