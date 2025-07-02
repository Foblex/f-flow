import { IRect } from '@foblex/2d';
import { FNodeBase } from '../../../f-node';

export class LineAlignmentPreparationRequest {
  static readonly fToken = Symbol('LineAlignmentPreparationRequest');

  constructor(
    public fNodes: FNodeBase[],
    public commonRect: IRect
  ) {
  }
}
