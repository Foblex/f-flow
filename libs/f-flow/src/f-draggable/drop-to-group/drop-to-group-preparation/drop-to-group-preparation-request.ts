import { IPointerEvent } from '../../infrastructure';

export class DropToGroupPreparationRequest {
  static readonly fToken = Symbol('DropToGroupPreparationRequest');

  constructor(public readonly event: IPointerEvent) {}
}
