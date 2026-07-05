import { FNodeBase } from '../../../../../f-node';
import { IPointerEvent } from '../../../../infrastructure';

export class CreateConnectionFromConnectorPreparationRequest {
  static readonly fToken = Symbol('CreateConnectionFromConnectorPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly node: FNodeBase,
  ) {}
}
