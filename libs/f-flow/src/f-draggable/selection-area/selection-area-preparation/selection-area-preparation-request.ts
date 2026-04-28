import { IPointerEvent } from '../../infrastructure';

export class SelectionAreaPreparationRequest {
  static readonly fToken = Symbol('SelectionAreaPreparationRequest');

  constructor(public readonly event: IPointerEvent) {}
}
