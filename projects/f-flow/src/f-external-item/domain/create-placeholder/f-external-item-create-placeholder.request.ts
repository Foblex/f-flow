import { FExternalItemBase } from '../../f-external-item-base';

export class FExternalItemCreatePlaceholderRequest {
  static readonly fToken = Symbol('FExternalItemCreatePlaceholderRequest');

  constructor(
    public fExternalItem: FExternalItemBase,
  ) {
  }
}
