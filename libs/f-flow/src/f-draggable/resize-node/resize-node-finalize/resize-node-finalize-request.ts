import { IPointerEvent } from '../../infrastructure';

export class ResizeNodeFinalizeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('ResizeNodeFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
