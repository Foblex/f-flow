import { FNodeBase } from '../../../../f-node';

export class ReadNodeBoundsWithPaddingsRequest {
  static readonly fToken = Symbol('ReadNodeBoundsWithPaddingsRequest');

  constructor(
    public readonly nodeOrGroup: FNodeBase,
    public readonly childrenPaddings: [number, number, number, number],
  ) {}
}
