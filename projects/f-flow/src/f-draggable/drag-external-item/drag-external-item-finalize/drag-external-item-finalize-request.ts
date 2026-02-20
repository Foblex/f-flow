import { IPointerEvent } from '../../../drag-toolkit';

export class DragExternalItemFinalizeRequest {
  static readonly fToken = Symbol('DragExternalItemFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
