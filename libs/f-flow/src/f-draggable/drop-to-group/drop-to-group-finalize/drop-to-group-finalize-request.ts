import { IPointerEvent } from '../../infrastructure';

export class DropToGroupFinalizeRequest {
  static readonly fToken = Symbol('DropToGroupFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
