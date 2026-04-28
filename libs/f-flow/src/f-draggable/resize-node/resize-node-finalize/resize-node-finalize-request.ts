import { IPointerEvent } from '../../infrastructure';

export class ResizeNodeFinalizeRequest {
  static readonly fToken = Symbol('ResizeNodeFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
