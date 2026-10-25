import { IRect } from '../../../../_libs/f-2d';

export class SetFCacheNodeRectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('SetFCacheNodeRectRequest');

  constructor(
    public readonly nodeId: string,
    public readonly rect: IRect,
  ) {}
}
