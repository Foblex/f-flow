import { FExternalItemBase } from '../../../f-external-item';

export class DragExternalItemCreatePlaceholderRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: HTMLElement | SVGElement;

  static readonly fToken = Symbol('DragExternalItemCreatePlaceholderRequest');

  constructor(public readonly externalItem: FExternalItemBase) {}
}
