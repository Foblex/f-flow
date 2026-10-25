import { IPointerEvent } from '../../infrastructure';

export class SelectionAreaPreparationRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('SelectionAreaPreparationRequest');

  constructor(public readonly event: IPointerEvent) {}
}
