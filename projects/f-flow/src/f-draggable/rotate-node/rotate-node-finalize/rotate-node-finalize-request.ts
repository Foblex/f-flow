import { IPointerEvent } from '../../../drag-toolkit';

export class RotateNodeFinalizeRequest {
  static readonly fToken = Symbol('RotateNodeFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
