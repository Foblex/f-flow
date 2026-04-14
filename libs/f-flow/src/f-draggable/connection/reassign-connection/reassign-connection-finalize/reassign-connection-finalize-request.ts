import { IPointerEvent } from '../../../../drag-toolkit';

export class ReassignConnectionFinalizeRequest {
  static readonly fToken = Symbol('ReassignConnectionFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
