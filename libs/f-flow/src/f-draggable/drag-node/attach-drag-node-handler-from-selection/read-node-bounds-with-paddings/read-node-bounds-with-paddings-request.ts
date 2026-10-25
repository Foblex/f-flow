import { FNodeBase } from '../../../../f-node';
import type { ReadNodeBoundsWithPaddingsResponse } from './read-node-bounds-with-paddings-response';

export class ReadNodeBoundsWithPaddingsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: ReadNodeBoundsWithPaddingsResponse;

  static readonly fToken = Symbol('ReadNodeBoundsWithPaddingsRequest');

  constructor(
    public readonly nodeOrGroup: FNodeBase,
    public readonly childrenPaddings: [number, number, number, number],
  ) {}
}
