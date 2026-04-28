import { IPointerEvent } from '../../infrastructure';

export class SelectionAreaFinalizeRequest {
  static readonly fToken = Symbol('SelectionAreaFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
