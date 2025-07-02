import { FExternalItemBase } from '../../f-external-item-base';

export class FExternalItemCreatePreviewRequest {
  static readonly fToken = Symbol('FExternalItemCreatePreviewRequest');

  constructor(
    public fExternalItem: FExternalItemBase,
  ) {
  }
}
