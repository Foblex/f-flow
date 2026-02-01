import { IPoint } from '@foblex/2d';

export type FConnectionEndpoint = 'source' | 'target';

export class FReassignConnectionEvent {
  // -----------------------------
  // Preferred API
  // -----------------------------

  public readonly connectionId: string;

  /** Which endpoint was reassigned. */
  public readonly endpoint: FConnectionEndpoint;

  /** Previous and next ids; `next*Id` can be `undefined` if dropped to nowhere. */
  public readonly previousSourceId: string;
  public readonly nextSourceId: string | undefined;

  public readonly previousTargetId: string;
  public readonly nextTargetId: string | undefined;

  /** Pointer position where the user dropped pointer. */
  public readonly dropPosition: IPoint;

  // -----------------------------
  // Deprecated compatibility API (keep as FIELDS)
  // -----------------------------

  /** @deprecated Use `endpoint === 'source'` */
  public readonly isSourceReassign: boolean;

  /** @deprecated Use `endpoint === 'target'` */
  public readonly isTargetReassign: boolean;

  /** @deprecated Use `previousSourceId` */
  public readonly oldSourceId: string;

  /** @deprecated Use `nextSourceId` */
  public readonly newSourceId: string | undefined;

  /** @deprecated Use `previousTargetId` */
  public readonly oldTargetId: string;

  /** @deprecated Use `nextTargetId` */
  public readonly newTargetId: string | undefined;

  /** @deprecated Use `dropPosition` */
  public readonly dropPoint: IPoint;

  constructor(
    connectionId: string,
    endpoint: FConnectionEndpoint,

    previousSourceId: string,
    nextSourceId: string | undefined,

    previousTargetId: string,
    nextTargetId: string | undefined,

    dropPosition: IPoint,
  ) {
    // preferred
    this.connectionId = connectionId;
    this.endpoint = endpoint;

    this.previousSourceId = previousSourceId;
    this.nextSourceId = nextSourceId;

    this.previousTargetId = previousTargetId;
    this.nextTargetId = nextTargetId;

    this.dropPosition = dropPosition;

    // legacy aliases (same values / references)
    this.isSourceReassign = endpoint === 'source';
    this.isTargetReassign = endpoint === 'target';

    this.oldSourceId = previousSourceId;
    this.newSourceId = nextSourceId;

    this.oldTargetId = previousTargetId;
    this.newTargetId = nextTargetId;

    this.dropPoint = dropPosition;
  }
}
