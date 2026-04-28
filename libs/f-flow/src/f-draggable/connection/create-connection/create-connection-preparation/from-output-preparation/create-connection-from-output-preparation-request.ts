import { FNodeBase } from '../../../../../f-node';
import { IPointerEvent } from '../../../../infrastructure';

export class CreateConnectionFromOutputPreparationRequest {
  static readonly fToken = Symbol('CreateConnectionFromOutputPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly node: FNodeBase,
  ) {}
}
