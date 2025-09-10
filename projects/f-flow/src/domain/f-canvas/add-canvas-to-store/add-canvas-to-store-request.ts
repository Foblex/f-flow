import { FCanvasBase } from '../../../f-canvas';

export class AddCanvasToStoreRequest {
  static readonly fToken = Symbol('AddCanvasToStoreRequest');
  constructor(
    public fCanvas: FCanvasBase,
  ) {
  }
}
