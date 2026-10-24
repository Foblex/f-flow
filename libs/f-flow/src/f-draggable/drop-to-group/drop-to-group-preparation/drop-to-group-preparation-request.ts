import { IPointerEvent } from '../../infrastructure';

export class DropToGroupPreparationRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DropToGroupPreparationRequest');

  constructor(public readonly event: IPointerEvent) {}
}
