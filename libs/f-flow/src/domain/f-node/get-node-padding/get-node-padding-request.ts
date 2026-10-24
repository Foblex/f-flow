import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/2d';

export class GetNodePaddingRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: [number, number, number, number];

  static readonly fToken = Symbol('GetNodePaddingRequest');
  constructor(
    public fNode: FNodeBase,
    public rect: IRect,
  ) {}
}
