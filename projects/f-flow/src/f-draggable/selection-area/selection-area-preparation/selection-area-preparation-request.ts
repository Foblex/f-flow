import { IPointerEvent } from '../../../drag-toolkit';

export class SelectionAreaPreparationRequest {
  static readonly fToken = Symbol('SelectionAreaPreparationRequest');

  constructor(public readonly event: IPointerEvent) {}
}
