import { FExternalItemBase } from '../../../f-external-item';

export class DragExternalItemCreatePlaceholderRequest {
  static readonly fToken = Symbol('DragExternalItemCreatePlaceholderRequest');

  constructor(public readonly externalItem: FExternalItemBase) {}
}
