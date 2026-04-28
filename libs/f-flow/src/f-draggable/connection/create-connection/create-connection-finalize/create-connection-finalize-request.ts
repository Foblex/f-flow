import { IPointerEvent } from '../../../infrastructure';

export class CreateConnectionFinalizeRequest {
  static readonly fToken = Symbol('CreateConnectionFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
