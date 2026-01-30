import { FNodeBase } from '../../../../../f-node';
import { IPointerEvent } from '../../../../../drag-toolkit';

export class CreateConnectionFromOutletPreparationRequest {
  static readonly fToken = Symbol('CreateConnectionFromOutletPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly node: FNodeBase,
  ) {}
}
