import { FCanvasBase } from '../../../f-canvas';

export class AddCanvasToStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AddCanvasToStoreRequest');
  constructor(public readonly instance: FCanvasBase) {}
}
