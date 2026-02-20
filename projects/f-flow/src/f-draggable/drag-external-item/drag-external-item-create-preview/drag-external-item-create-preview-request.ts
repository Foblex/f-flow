import { FExternalItemBase } from '../../../f-external-item';

export class DragExternalItemCreatePreviewRequest {
  static readonly fToken = Symbol('DragExternalItemCreatePreviewRequest');

  constructor(public readonly externalItem: FExternalItemBase) {}
}
