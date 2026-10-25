import { IFCacheNodeRef } from '../../../model';

export class RegisterFCacheNodeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RegisterFCacheNodeRequest');

  constructor(
    public readonly id: string,
    public readonly element: HTMLElement | SVGElement,
    public readonly reference: IFCacheNodeRef,
  ) {}
}
