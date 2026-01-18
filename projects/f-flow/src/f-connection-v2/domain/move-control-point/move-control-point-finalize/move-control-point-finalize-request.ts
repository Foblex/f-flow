import { IPointerEvent } from '../../../../drag-toolkit';

export class MoveControlPointFinalizeRequest {
  static readonly fToken = Symbol('MoveControlPointFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
