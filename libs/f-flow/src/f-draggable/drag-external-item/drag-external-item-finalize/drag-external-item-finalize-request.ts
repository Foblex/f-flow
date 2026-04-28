import { IPointerEvent } from '../../infrastructure';

export class DragExternalItemFinalizeRequest {
  static readonly fToken = Symbol('DragExternalItemFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
