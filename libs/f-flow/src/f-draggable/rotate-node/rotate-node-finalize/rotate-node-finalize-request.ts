import { IPointerEvent } from '../../infrastructure';

export class RotateNodeFinalizeRequest {
  static readonly fToken = Symbol('RotateNodeFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
