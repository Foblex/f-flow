import { IPointerEvent } from '../../../../drag-toolkit';

export class CreateConnectionFinalizeRequest {
  static readonly fToken = Symbol('CreateConnectionFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
