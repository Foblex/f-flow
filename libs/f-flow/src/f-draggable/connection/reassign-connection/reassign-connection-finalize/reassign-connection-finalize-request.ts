import { IPointerEvent } from '../../../infrastructure';

export class ReassignConnectionFinalizeRequest {
  static readonly fToken = Symbol('ReassignConnectionFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
