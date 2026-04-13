import { IPointerEvent } from '../../../drag-toolkit';

export class ResizeNodeFinalizeRequest {
  static readonly fToken = Symbol('ResizeNodeFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
