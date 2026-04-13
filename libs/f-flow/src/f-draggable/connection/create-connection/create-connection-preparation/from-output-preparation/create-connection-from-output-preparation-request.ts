import { FNodeBase } from '../../../../../f-node';
import { IPointerEvent } from '../../../../../drag-toolkit';

export class CreateConnectionFromOutputPreparationRequest {
  static readonly fToken = Symbol('CreateConnectionFromOutputPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly node: FNodeBase,
  ) {}
}
