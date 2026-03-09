import { PreventDefaultIsExternalItem } from './prevent-default-is-external-item';
import { DragExternalItemCreatePlaceholder } from './drag-external-item-create-placeholder';
import { DragExternalItemCreatePreview } from './drag-external-item-create-preview';
import { DragExternalItemFinalize } from './drag-external-item-finalize';
import { DragExternalItemPreparation } from './drag-external-item-preparation';

export const DRAG_EXTERNAL_ITEM_PROVIDERS = [
  DragExternalItemCreatePlaceholder,

  DragExternalItemCreatePreview,

  DragExternalItemFinalize,

  DragExternalItemPreparation,

  PreventDefaultIsExternalItem,
];
