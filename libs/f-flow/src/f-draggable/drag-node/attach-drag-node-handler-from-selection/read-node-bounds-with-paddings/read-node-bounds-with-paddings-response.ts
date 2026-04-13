import { FNodeBase } from '../../../../f-node';
import { IRect } from '@foblex/2d';

export class ReadNodeBoundsWithPaddingsResponse {
  constructor(
    public readonly nodeOrGroup: FNodeBase,
    public readonly boundingRect: IRect,
    public readonly innerRect: IRect,
    public readonly paddings: [number, number, number, number],
  ) {}
}
