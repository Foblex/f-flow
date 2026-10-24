import { IPointerEvent } from '../../infrastructure';

export class DropToGroupFinalizeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DropToGroupFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
