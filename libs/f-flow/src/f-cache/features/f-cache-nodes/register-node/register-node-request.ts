import { IFCacheNodeRef } from '../../../model';

export class RegisterFCacheNodeRequest {
  static readonly fToken = Symbol('RegisterFCacheNodeRequest');

  constructor(
    public readonly id: string,
    public readonly element: HTMLElement | SVGElement,
    public readonly reference: IFCacheNodeRef,
  ) {}
}
