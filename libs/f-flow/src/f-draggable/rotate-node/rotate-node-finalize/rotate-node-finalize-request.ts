import { IPointerEvent } from '../../infrastructure';

export class RotateNodeFinalizeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RotateNodeFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
