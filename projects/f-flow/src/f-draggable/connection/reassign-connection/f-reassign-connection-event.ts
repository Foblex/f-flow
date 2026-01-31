import { IPoint } from '@foblex/2d';

export type FConnectionEndpoint = 'source' | 'target';

export class FReassignConnectionEvent {
  // -----------------------------
  // Deprecated compatibility API
  // -----------------------------

  /** @deprecated Use `endpoint === 'source'` */
  public get isSourceReassign(): boolean {
    return this.endpoint === 'source';
  }

  /** @deprecated Use `endpoint === 'target'` */
  public get isTargetReassign(): boolean {
    return this.endpoint === 'target';
  }

  /** @deprecated Use `previousSourceId` */
  public get oldSourceId(): string {
    return this.previousSourceId;
  }

  /** @deprecated Use `nextSourceId` */
  public get newSourceId(): string | undefined {
    return this.nextSourceId;
  }

  /** @deprecated Use `previousTargetId` */
  public get oldTargetId(): string {
    return this.previousTargetId;
  }

  /** @deprecated Use `nextTargetId` */
  public get newTargetId(): string | undefined {
    return this.nextTargetId;
  }

  /** @deprecated Use `dropPosition` */
  public get dropPoint(): IPoint {
    return this.dropPosition;
  }

  constructor(
    public readonly connectionId: string,

    /** Which endpoint was reassigned. */
    public readonly endpoint: FConnectionEndpoint,

    /** Previous and next ids; `nextId` can be `undefined` if dropped to nowhere. */
    public readonly previousSourceId: string,
    public readonly nextSourceId: string | undefined,

    public readonly previousTargetId: string,
    public readonly nextTargetId: string | undefined,

    /** Pointer position where the user dropped pointer. */
    public readonly dropPosition: IPoint,
  ) {}
}
